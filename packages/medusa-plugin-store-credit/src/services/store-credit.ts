import {
  EventBusService,
  FindConfig,
  Selector,
  TransactionBaseService,
  buildQuery,
  setMetadata,
} from "@medusajs/medusa";
import RegionRepository from "@medusajs/medusa/dist/repositories/region";
import { MedusaError, isDefined } from "medusa-core-utils";
import { EntityManager } from "typeorm";
import { StoreCredit } from "../models/store-credit";
import StoreCreditRepository from "../repositories/store-credit";
import StoreCreditTransactionRepository from "../repositories/store-credit-transaction";

export type CreateStoreCreditInput = {
  value?: number;
  balance?: number;
  ends_at?: Date;
  is_disabled?: boolean;
  region_id: string;
  metadata?: Record<string, unknown>;
};

export type UpdateStoreCreditInput = {
  balance?: number;
  ends_at?: Date | null;
  is_disabled?: boolean;
  region_id?: string;
  metadata?: Record<string, unknown>;
};

export type CreateStoreCreditTransactionInput = {
  store_credit_id: string;
  order_id: string;
  amount: number;
  created_at?: Date;
};

type InjectedDependencies = {
  manager: EntityManager;
  storeCreditRepository: typeof StoreCreditRepository;
  storeCreditTransactionRepository: typeof StoreCreditTransactionRepository;
  regionRepository: typeof RegionRepository;
  eventBusService: EventBusService;
};
/**
 * Provides layer to manipulate store credits.
 */
class StoreCreditService extends TransactionBaseService {
  protected readonly storeCreditRepository_: typeof StoreCreditRepository;
  protected readonly storeCreditTransactionRepo_: typeof StoreCreditTransactionRepository;
  protected readonly regionRepository_: typeof RegionRepository;
  protected readonly eventBus_: EventBusService;

  static Events = {
    CREATED: "store_credit.created",
  };

  constructor({
    storeCreditRepository,
    storeCreditTransactionRepository,
    regionRepository,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.storeCreditRepository_ = storeCreditRepository;
    this.storeCreditTransactionRepo_ = storeCreditTransactionRepository;
    this.regionRepository_ = regionRepository;
    this.eventBus_ = eventBusService;
  }

  async listAndCount(
    selector: Selector<StoreCredit> = {},
    config: FindConfig<StoreCredit> = { relations: [], skip: 0, take: 10 },
  ): Promise<[StoreCredit[], number]> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_,
    );

    // let q: string | undefined
    // if (isDefined(selector.q)) {
    //   q = selector.q
    //   delete selector.q
    // }

    const query = buildQuery(selector, config);

    return await storeCreditRepo.listAndCount(query);
  }

  async getValidStoreCredits(customerId: string): Promise<StoreCredit[]> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_,
    );

    return storeCreditRepo.getValidStoreCredits(customerId);
  }

  async getValidStoreCreditsForRegion(
    customerId: string,
    regionId: string,
  ): Promise<StoreCredit[]> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_,
    );

    return storeCreditRepo.getValidStoreCreditsForRegion(customerId, regionId);
  }

  async createTransaction(
    data: CreateStoreCreditTransactionInput,
  ): Promise<string> {
    const sctRepo = this.activeManager_.withRepository(
      this.storeCreditTransactionRepo_,
    );
    const created = sctRepo.create(data);
    const saved = await sctRepo.save(created);
    return saved.id;
  }

  async create(storeCredit: CreateStoreCreditInput): Promise<StoreCredit> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_);
      const storeCreditRepo = manager.withRepository(
        this.storeCreditRepository_,
      );

      const region = await regionRepo.findOne({
        where: { id: storeCredit.region_id },
      });

      if (!region) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Region with ${storeCredit.region_id} was not found`,
        );
      }

      const toCreate = {
        ...storeCredit,
        region_id: region.id,
      };

      const created = storeCreditRepo.create(toCreate);
      const result = await storeCreditRepo.save(created);

      await this.eventBus_
        .withTransaction(manager)
        .emit(StoreCreditService.Events.CREATED, {
          id: result.id,
        });

      return result;
    });
  }

  protected async retrieve_(
    selector: Selector<StoreCredit>,
    config: FindConfig<StoreCredit> = {},
  ): Promise<StoreCredit> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_,
    );

    const query = buildQuery(selector, config);
    query.relationLoadStrategy = "query";

    const storeCredit = await storeCreditRepo.findOne(query);

    if (!storeCredit) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Store credit with ${selectorConstraints} was not found`,
      );
    }

    return storeCredit;
  }

  async retrieve(
    storeCreditId: string,
    config: FindConfig<StoreCredit> = {},
  ): Promise<StoreCredit> {
    if (!isDefined(storeCreditId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"storeCreditId" must be defined`,
      );
    }

    return await this.retrieve_({ id: storeCreditId }, config);
  }

  async update(
    storeCreditId: string,
    update: UpdateStoreCreditInput,
  ): Promise<StoreCredit> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_);
      const storeCreditRepo = manager.withRepository(
        this.storeCreditRepository_,
      );

      const storeCredit = await this.retrieve(storeCreditId);

      const { region_id, metadata, balance, ...rest } = update;

      if (region_id && region_id !== storeCredit.region_id) {
        const region = await regionRepo.findOne({
          where: { id: region_id },
        });

        if (!region) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Region with ${storeCredit.region_id} was not found`,
          );
        }

        storeCredit.region_id = region.id;
      }

      if (metadata) {
        storeCredit.metadata = setMetadata(storeCredit, metadata);
      }

      if (isDefined(balance)) {
        if (balance < 0 || storeCredit.value < balance) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "new balance is invalid",
          );
        }

        storeCredit.balance = balance;
      }

      for (const [key, value] of Object.entries(rest)) {
        storeCredit[key] = value;
      }

      return await storeCreditRepo.save(storeCredit);
    });
  }

  async delete(storeCreditId: string): Promise<StoreCredit | void> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_,
    );

    const storeCredit = await storeCreditRepo.findOne({
      where: { id: storeCreditId },
    });

    if (!storeCredit) {
      return;
    }

    return await storeCreditRepo.softRemove(storeCredit);
  }
}

export default StoreCreditService;

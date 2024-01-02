import {
  Customer,
  EventBusService,
  FindConfig,
  Region,
  RegionService,
  Selector,
  TransactionBaseService,
  buildQuery,
  setMetadata,
} from "@medusajs/medusa";
import { MedusaError, isDefined } from "medusa-core-utils";
import { And, EntityManager } from "typeorm";
import { StoreCredit } from "../models/store-credit";
import StoreCreditRepository from "../repositories/store-credit";
import StoreCreditTransactionRepository from "../repositories/store-credit-transaction";

// import { isDefined, MedusaError } from "medusa-core-utils"
// import randomize from "randomatic"
// import { EntityManager } from "typeorm"
// import { TransactionBaseService } from "../interfaces"
// import { GiftCard, Region } from "../models"
// import { GiftCardRepository } from "../repositories/gift-card"
// import { GiftCardTransactionRepository } from "../repositories/gift-card-transaction"
// import { FindConfig, QuerySelector, Selector } from "../types/common"
// import {
//   CreateGiftCardInput,
//   CreateGiftCardTransactionInput,
//   UpdateGiftCardInput,
// } from "../types/gift-card"
// import { buildQuery, setMetadata } from "../utils"
// import EventBusService from "./event-bus"
// import RegionService from "./region"

export type CreateStoreCreditInput = {
  // order_id?: string
  value?: number;
  balance?: number;
  ends_at?: Date;
  is_disabled?: boolean;
  region_id: string;
  metadata?: Record<string, unknown>;
  // tax_rate?: number | null
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
  // is_taxable?: boolean
  // tax_rate?: number | null
};

type InjectedDependencies = {
  manager: EntityManager;
  storeCreditRepository: typeof StoreCreditRepository;
  storeCreditTransactionRepository: typeof StoreCreditTransactionRepository;
  // giftCardRepository: typeof GiftCardRepository;
  // giftCardTransactionRepository: typeof GiftCardTransactionRepository;
  regionService: RegionService;
  eventBusService: EventBusService;
};
/**
 * Provides layer to manipulate gift cards.
 */
class StoreCreditService extends TransactionBaseService {
  // protected readonly giftCardRepository_: typeof GiftCardRepository
  // eslint-disable-next-line max-len
  // protected readonly giftCardTransactionRepo_: typeof GiftCardTransactionRepository
  protected readonly storeCreditRepository_: typeof StoreCreditRepository;
  protected readonly storeCreditTransactionRepo_: typeof StoreCreditTransactionRepository;
  protected readonly regionService_: RegionService;
  protected readonly eventBus_: EventBusService;

  static Events = {
    CREATED: "store_credit.created",
  };

  constructor({
    regionService,
    // giftCardRepository,
    // giftCardTransactionRepository,
    storeCreditRepository,
    storeCreditTransactionRepository,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    // this.giftCardRepository_ = giftCardRepository
    // this.giftCardTransactionRepo_ = giftCardTransactionRepository
    this.storeCreditRepository_ = storeCreditRepository;
    this.storeCreditTransactionRepo_ = storeCreditTransactionRepository;
    this.regionService_ = regionService;
    this.eventBus_ = eventBusService;
  }

  /**
   * Generates a 16 character gift card code
   * @return the generated gift card code
   */
  // static generateCode(): string {
  //   const code = [
  //     randomize("A0", 4),
  //     randomize("A0", 4),
  //     randomize("A0", 4),
  //     randomize("A0", 4),
  //   ].join("-");

  //   return code;
  // }

  /**
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @return the result of the find operation
   */
  async listAndCount(
    selector: Selector<StoreCredit> = {},
    config: FindConfig<StoreCredit> = { relations: [], skip: 0, take: 10 }
  ): Promise<[StoreCredit[], number]> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
    );

    // let q: string | undefined
    // if (isDefined(selector.q)) {
    //   q = selector.q
    //   delete selector.q
    // }

    const query = buildQuery(selector, config);

    return await storeCreditRepo.listAndCount(query);
  }

  async listAndCountCustomers(
    selector: { q?: string } = {},
    config: { skip: number; take: number } = { skip: 0, take: 10 }
  ): Promise<
    [
      { customer: Customer; region: Region; amount: number; balance: number }[],
      number
    ]
  > {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
    );

    return await storeCreditRepo.listAndCountCustomers(selector, config);
  }

  /**
   * Select only store credits that are:
   * - tied to this customer
   * - tied to this region
   * - not disabled
   * - not expired
   * - not used up (have balance > 0)
   */
  async getValidStoreCredits(customerId: string): Promise<StoreCredit[]> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
    );

    return storeCreditRepo.getValidStoreCredits(customerId);
  }

  async getValidStoreCreditsForRegion(
    customerId: string,
    regionId: string
  ): Promise<StoreCredit[]> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
    );

    return storeCreditRepo.getValidStoreCreditsForRegion(customerId, regionId);
  }

  // /**
  //  * @param selector - the query object for find
  //  * @param config - the configuration used to find the objects. contains relations, skip, and take.
  //  * @return the result of the find operation
  //  */
  // async list(
  //   selector: QuerySelector<GiftCard> = {},
  //   config: FindConfig<GiftCard> = { relations: [], skip: 0, take: 10 }
  // ): Promise<GiftCard[]> {
  //   const [cards] = await this.listAndCount(selector, config)
  //   return cards
  // }

  async createTransaction(
    data: CreateStoreCreditTransactionInput
  ): Promise<string> {
    const sctRepo = this.activeManager_.withRepository(
      this.storeCreditTransactionRepo_
    );
    const created = sctRepo.create(data);
    const saved = await sctRepo.save(created);
    return saved.id;
  }

  /**
   * Creates a gift card with provided data given that the data is validated.
   * @param giftCard - the gift card data to create
   * @return the result of the create operation
   */
  async create(storeCredit: CreateStoreCreditInput): Promise<StoreCredit> {
    return await this.atomicPhase_(async (manager) => {
      const storeCreditRepo = manager.withRepository(
        this.storeCreditRepository_
      );

      // Will throw if region does not exist
      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(storeCredit.region_id);

      // const code = StoreCreditService.generateCode()
      // const taxRate = StoreCreditService.resolveTaxRate(
      //   giftCard.tax_rate || null,
      //   region
      // )
      const toCreate = {
        // code,
        ...storeCredit,
        region_id: region.id,
        // tax_rate: taxRate,
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

  // /**
  //  * The tax_rate of the giftcard can depend on whether regions tax gift cards, an input
  //  * provided by the user or the tax rate. Based on these conditions, tax_rate changes.
  //  * @return the tax rate for the gift card
  //  */
  // protected static resolveTaxRate(
  //   giftCardTaxRate: number | null,
  //   region: Region
  // ): number | null {
  //   // A gift card is always associated with a region. If the region doesn't tax gift cards,
  //   // return null
  //   if (!region.gift_cards_taxable) {
  //     return null
  //   }

  //   // If a tax rate has been provided as an input from an external input, use that
  //   // This would handle cases where gift cards are created as a part of an order where taxes better defined
  //   // or to handle usecases outside of the opinions of the core.
  //   if (giftCardTaxRate) {
  //     return giftCardTaxRate
  //   }

  //   // Outside the context of the taxRate input, it picks up the tax rate directly from the region
  //   return region.tax_rate || null
  // }

  protected async retrieve_(
    selector: Selector<StoreCredit>,
    config: FindConfig<StoreCredit> = {}
  ): Promise<StoreCredit> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
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
        `Store credit with ${selectorConstraints} was not found`
      );
    }

    return storeCredit;
  }

  /**
   * Gets a store credit by id.
   * @param storeCreditId - id of store credit to retrieve
   * @param config - optional values to include with store credit query
   * @return the store card
   */
  async retrieve(
    storeCreditId: string,
    config: FindConfig<StoreCredit> = {}
  ): Promise<StoreCredit> {
    if (!isDefined(storeCreditId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"storeCreditId" must be defined`
      );
    }

    return await this.retrieve_({ id: storeCreditId }, config);
  }

  // async retrieveByCode(
  //   code: string,
  //   config: FindConfig<GiftCard> = {}
  // ): Promise<GiftCard> {
  //   if (!isDefined(code)) {
  //     throw new MedusaError(
  //       MedusaError.Types.NOT_FOUND,
  //       `"code" must be defined`
  //     )
  //   }

  //   return await this.retrieve_({ code }, config)
  // }

  /**
   * Updates a single store credit.
   * @param storeCreditId - storeCredit id of store credit to update
   * @param update - the data to update the storeCredit with
   * @return the result of the update operation
   */
  async update(
    storeCreditId: string,
    update: UpdateStoreCreditInput
  ): Promise<StoreCredit> {
    return await this.atomicPhase_(async (manager) => {
      const storeCreditRepo = manager.withRepository(
        this.storeCreditRepository_
      );

      const storeCredit = await this.retrieve(storeCreditId);

      const { region_id, metadata, balance, ...rest } = update;

      if (region_id && region_id !== storeCredit.region_id) {
        const region = await this.regionService_
          .withTransaction(manager)
          .retrieve(region_id);
        storeCredit.region_id = region.id;
      }

      if (metadata) {
        storeCredit.metadata = setMetadata(storeCredit, metadata);
      }

      if (isDefined(balance)) {
        if (balance < 0 || storeCredit.value < balance) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "new balance is invalid"
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

  /**
   * Deletes store credit idempotently
   * @param storeCreditId - id of store credit to delete
   * @return the result of the delete operation
   */
  async delete(storeCreditId: string): Promise<StoreCredit | void> {
    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
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

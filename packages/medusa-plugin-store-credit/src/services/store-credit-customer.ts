import {
  Customer,
  CustomerService,
  EventBusService,
  FindConfig,
  Region,
  RegionService,
  Selector,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { uniq } from "lodash";
import { EntityManager } from "typeorm";
import StoreCreditRepository from "../repositories/store-credit";
import StoreCreditTransactionRepository from "../repositories/store-credit-transaction";
import { StoreCredit } from "../models/store-credit";
import { MedusaError, isDefined } from "medusa-core-utils";
import { StoreCreditCustomer } from "../admin/packages/admin-client";

type InjectedDependencies = {
  manager: EntityManager;
  storeCreditRepository: typeof StoreCreditRepository;
  storeCreditTransactionRepository: typeof StoreCreditTransactionRepository;
  customerService: CustomerService;
  regionService: RegionService;
  eventBusService: EventBusService;
};
/**
 * Provides layer to manipulate store credit customers.
 */
class StoreCreditCustomerService extends TransactionBaseService {
  protected readonly storeCreditRepository_: typeof StoreCreditRepository;
  protected readonly storeCreditTransactionRepo_: typeof StoreCreditTransactionRepository;
  protected readonly customerService_: CustomerService;
  protected readonly regionService_: RegionService;
  protected readonly eventBus_: EventBusService;

  constructor({
    regionService,
    storeCreditRepository,
    storeCreditTransactionRepository,
    customerService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.storeCreditRepository_ = storeCreditRepository;
    this.storeCreditTransactionRepo_ = storeCreditTransactionRepository;
    this.customerService_ = customerService;
    this.regionService_ = regionService;
    this.eventBus_ = eventBusService;
  }

  async listAndCount(
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

    const [storeCreditCustomers, count] =
      await storeCreditRepo.listAndCountCustomers(selector, config);

    const customerIds = uniq(
      storeCreditCustomers.map((scc) => scc.customer_id)
    );

    const customers = await this.customerService_.list(
      { id: customerIds },
      { take: config.take }
    );

    const regions = await this.regionService_.list(undefined, { take: 99999 });

    console.log("customerIds", customerIds);
    console.log("customers", customers);

    const completeStoreCreditCustomers = storeCreditCustomers.map((scc) => {
      const customer = customers.find((c) => c.id === scc.customer_id);
      const region = regions.find((r) => r.id === scc.region_id);
      return {
        customer,
        region,
        amount: scc.amount,
        balance: scc.balance,
      };
    });

    return [completeStoreCreditCustomers, count];
  }

  async listAndCountStoreCredits(
    selector: Selector<StoreCredit> & { customer_id: string },
    config: FindConfig<StoreCredit> = { skip: 0, take: 10 }
  ): Promise<[StoreCredit[], number]> {
    if (!isDefined(selector.customer_id)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"customer_id" must be defined`
      );
    }

    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
    );

    const query = buildQuery(selector, config);

    const [store_credits, count] = await storeCreditRepo.findAndCount(query);

    console.log("store_credits", store_credits);

    return [store_credits, count];
  }

  async retrieve(
    customerId: string,
    regionId: string
  ): Promise<StoreCreditCustomer> {
    if (!isDefined(customerId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"customerId" must be defined`
      );
    }

    if (!isDefined(regionId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"regionId" must be defined`
      );
    }

    const region = await this.regionService_.retrieve(regionId);
    const customer = await this.customerService_.retrieve(customerId);

    const storeCreditRepo = this.activeManager_.withRepository(
      this.storeCreditRepository_
    );

    const storeCredits = await storeCreditRepo.getValidStoreCreditsForRegion(
      customerId,
      regionId
    );

    return {
      customer,
      region,
      value: storeCredits.reduce((acc, cur) => acc + cur.value, 0),
      balance: storeCredits.reduce((acc, cur) => acc + cur.balance, 0),
    };
  }
}

export default StoreCreditCustomerService;

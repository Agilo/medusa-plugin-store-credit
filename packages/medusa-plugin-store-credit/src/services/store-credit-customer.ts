import {
  Customer,
  CustomerService,
  EventBusService,
  Region,
  RegionService,
  TransactionBaseService,
} from "@medusajs/medusa";
import { uniq } from "lodash";
import { EntityManager } from "typeorm";
import StoreCreditRepository from "../repositories/store-credit";
import StoreCreditTransactionRepository from "../repositories/store-credit-transaction";

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
}

export default StoreCreditCustomerService;

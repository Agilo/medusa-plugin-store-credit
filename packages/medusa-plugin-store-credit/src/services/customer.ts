import {
  FindConfig,
  Customer as MedusaCustomer,
  CustomerService as MedusaCustomerService,
  RegionService,
} from "@medusajs/medusa";
import { Customer } from "../models/customer";
import StoreCreditService from "./store-credit";

class CustomerService extends MedusaCustomerService {
  protected readonly regionService_: RegionService;
  protected readonly storeCreditService_: StoreCreditService;

  constructor({ regionService, storeCreditService }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.regionService_ = regionService;
    this.storeCreditService_ = storeCreditService;
  }

  async retrieve(
    customerId: string,
    config: FindConfig<MedusaCustomer> = {},
  ): Promise<Customer> {
    const customer = await super.retrieve(customerId, config);
    return await this.decorateStoreCredits(customer);
  }

  async decorateStoreCredits(customer: MedusaCustomer): Promise<Customer> {
    const regionService = this.regionService_.withTransaction(
      this.activeManager_,
    );
    const storeCreditService = this.storeCreditService_.withTransaction(
      this.activeManager_,
    );

    const regions = await regionService.list(undefined, { take: 99999 });

    const storeCredits = await storeCreditService.getValidStoreCredits(
      customer.id,
    );

    customer.store_credits = storeCredits.reduce(
      (acc, curr) => {
        const region = acc.find(
          (region) => region.region_id === curr.region_id,
        );
        if (region) {
          region.balance += curr.balance;
        }
        return acc;
      },
      regions.map((region) => ({ region_id: region.id, balance: 0 })),
    );

    return customer;
  }
}

export default CustomerService;

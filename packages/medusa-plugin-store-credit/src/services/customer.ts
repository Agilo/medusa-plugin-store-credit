import {
  FindConfig,
  Customer as MedusaCustomer,
  CustomerService as MedusaCustomerService,
} from "@medusajs/medusa";
import { Customer } from "../models/customer";
import StoreCreditService from "./store-credit";
import RegionRepository from "@medusajs/medusa/dist/repositories/region";

class CustomerService extends MedusaCustomerService {
  protected readonly regionRepository_: typeof RegionRepository;
  protected readonly storeCreditService_: StoreCreditService;

  constructor({ regionRepository, storeCreditService }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.regionRepository_ = regionRepository;
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
    const regionRepo = this.activeManager_.withRepository(
      this.regionRepository_,
    );
    const storeCreditService = this.storeCreditService_.withTransaction(
      this.activeManager_,
    );

    const regions = await regionRepo.find({ skip: 0, take: 99999 });

    const storeCredits = await storeCreditService.getValidStoreCredits(
      customer.id,
    );

    customer.store_credits = storeCredits
      .reduce(
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
      )
      .sort((a, b) => b.balance - a.balance);

    return customer;
  }
}

export default CustomerService;

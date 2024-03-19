import { TotalsService as MedusaTotalsService } from "@medusajs/medusa";
import { Cart } from "../models/cart";
import { Order } from "../models/order";
import NewTotalsService from "./new-totals";
import StoreCreditService from "./store-credit";

type GetTotalsOptions = {
  exclude_gift_cards?: boolean;
  force_taxes?: boolean;
};

class TotalsService extends MedusaTotalsService {
  protected readonly storeCreditService_: StoreCreditService;

  constructor({ storeCreditService }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.storeCreditService_ = storeCreditService;
  }

  async getTotal(
    cartOrOrder: Cart | Order,
    options: GetTotalsOptions = {},
  ): Promise<number> {
    const newTotalsService = this.newTotalsService_ as NewTotalsService;
    const total = await super.getTotal(cartOrOrder, options);
    const storeCreditableAmount =
      newTotalsService.getStoreCreditableAmount(total);

    let storeCreditTotal = 0;

    if (cartOrOrder.object === "cart" && cartOrOrder.customer_id) {
      const storeCredits =
        await this.storeCreditService_.getValidStoreCreditsForRegion(
          cartOrOrder.customer_id,
          cartOrOrder.region_id,
        );
      storeCreditTotal = newTotalsService.getStoreCreditTotals(
        storeCreditableAmount,
        {
          storeCredits,
        },
      );
    } else if (cartOrOrder.object === "order") {
      storeCreditTotal = newTotalsService.getStoreCreditTotals(
        storeCreditableAmount,
        {
          storeCreditTransactions: cartOrOrder.store_credit_transactions || [],
        },
      );
    }

    return total - storeCreditTotal;
  }
}

export default TotalsService;

import {
  CartService as MedusaCartService,
  WithRequiredProperty,
} from "@medusajs/medusa";
import { Cart } from "../models/cart";
import NewTotalsService from "./new-totals";
import StoreCreditService from "./store-credit";

type TotalsConfig = {
  force_taxes?: boolean;
};

class CartService extends MedusaCartService {
  protected readonly storeCreditService_: StoreCreditService;

  constructor({ storeCreditService }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.storeCreditService_ = storeCreditService;
  }

  async decorateTotals(
    cart: Cart,
    totalsConfig: TotalsConfig = {},
  ): Promise<WithRequiredProperty<Cart, "total">> {
    const cart_ = await super.decorateTotals(cart, totalsConfig);
    return await this.decorateStoreCreditTotals(cart_);
  }

  async decorateStoreCreditTotals(cart: WithRequiredProperty<Cart, "total">) {
    const newTotalsService = this.newTotalsService_.withTransaction(
      this.activeManager_,
    ) as NewTotalsService;

    if (!cart.customer_id) {
      cart.store_credit_total = 0;
      return cart;
    }

    const storeCredits =
      await this.storeCreditService_.getValidStoreCreditsForRegion(
        cart.customer_id,
        cart.region_id,
      );

    const storeCreditableAmount = newTotalsService.getStoreCreditableAmount(
      cart.total,
    );

    const storeCreditTotal = newTotalsService.getStoreCreditTotals(
      storeCreditableAmount,
      {
        storeCredits: storeCredits,
      },
    );

    cart.store_credit_total = storeCreditTotal;

    // prettier-ignore
    cart.total =
      cart.subtotal +
      cart.shipping_total +
      cart.tax_total -
      (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total + cart.store_credit_total)

    return cart;
  }
}

export default CartService;

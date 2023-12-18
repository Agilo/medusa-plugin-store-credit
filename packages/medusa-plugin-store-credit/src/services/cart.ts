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

console.log(" ---------- cart.ts ---------- ");

class CartService extends MedusaCartService {
  protected readonly storeCreditService_: StoreCreditService;

  // prettier-ignore
  constructor({
    cartRepository,
    shippingMethodRepository,
    lineItemRepository,
    eventBusService,
    paymentProviderService,
    productService,
    productVariantService,
    taxProviderService,
    regionService,
    lineItemService,
    shippingOptionService,
    shippingProfileService,
    customerService,
    discountService,
    giftCardService,
    totalsService,
    newTotalsService,
    addressRepository,
    paymentSessionRepository,
    customShippingOptionService,
    lineItemAdjustmentService,
    priceSelectionStrategy,
    salesChannelService,
    featureFlagRouter,
    storeService,
    productVariantInventoryService,
    pricingService,
    storeCreditService,
  }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.storeCreditService_ = storeCreditService
  }

  async decorateTotals(
    cart: Cart,
    totalsConfig: TotalsConfig = {}
  ): Promise<WithRequiredProperty<Cart, "total">> {
    const cart_: Cart = await super.decorateTotals(cart, totalsConfig);
    return await this.decorateStoreCreditTotals(cart_);
  }

  async decorateStoreCreditTotals(
    cart: Cart
  ): Promise<WithRequiredProperty<Cart, "total">> {
    const cart_: Cart = cart;

    if (!cart_.customer_id) {
      cart_.store_credit_total = 0;
      return cart_ as Cart & { total: number };
    }

    const storeCredits =
      await this.storeCreditService_.getValidStoreCreditsForRegion(
        cart_.customer_id,
        cart_.region_id
      );

    const storeCreditableAmount = (
      this.newTotalsService_ as NewTotalsService
    ).getStoreCreditableAmount(cart_.total);

    const storeCreditTotal = (
      this.newTotalsService_ as NewTotalsService
    ).getStoreCreditTotals(storeCreditableAmount, {
      storeCredits: storeCredits,
    });

    cart_.store_credit_total = storeCreditTotal;

    // prettier-ignore
    cart_.total =
      cart_.subtotal +
      cart_.shipping_total +
      cart_.tax_total -
      (cart_.gift_card_total + cart_.discount_total + cart_.gift_card_tax_total + cart_.store_credit_total)

    return cart_ as Cart & { total: number };
  }
}

export default CartService;

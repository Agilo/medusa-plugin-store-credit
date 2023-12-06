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

  // prettier-ignore
  async decorateTotals(
    cart: Cart,
    totalsConfig: TotalsConfig = {}
  ): Promise<WithRequiredProperty<Cart, "total">> {
    const cart_: Cart = await super.decorateTotals(cart, totalsConfig);

    /**
     * Handle store credits
     * todo: replace with super.decorateTotals() ?
     */

    const [storeCredits] = await this.storeCreditService_.listAndCount();

    const storeCreditableAmount = (this.newTotalsService_ as NewTotalsService).getStoreCreditableAmount({
      // gift_cards_taxable: cart.region?.gift_cards_taxable,
      subtotal: cart_.subtotal,
      discount_total: cart_.discount_total,
      shipping_total: cart_.shipping_total,
      tax_total: cart_.tax_total,
      gift_card_total: cart_.gift_card_total,
      gift_card_tax_total: cart_.gift_card_tax_total,
    });

    const storeCreditTotal = await (this.newTotalsService_ as NewTotalsService).getStoreCreditTotals(
      storeCreditableAmount,
      {
        region: cart_.region,
        storeCredits: storeCredits,
      }
    );

    cart_.store_credit_total = storeCreditTotal.total || 0;

    cart_.total =
    cart_.subtotal +
    cart_.shipping_total +
    cart_.tax_total -
      (cart_.gift_card_total + cart_.discount_total + cart_.gift_card_tax_total + cart_.store_credit_total)

    return cart_ as Cart & { total: number }
  }
}

export default CartService;

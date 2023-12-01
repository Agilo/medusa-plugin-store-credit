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
    const newTotalsServiceTx = this.newTotalsService_.withTransaction(
      this.activeManager_
    )

    const calculationContext = await this.totalsService_.getCalculationContext(
      cart
    )
    const includeTax = totalsConfig?.force_taxes || cart.region?.automatic_taxes
    const cartItems = [...(cart.items ?? [])]
    const cartShippingMethods = [...(cart.shipping_methods ?? [])]

    if (includeTax) {
      const taxLinesMaps = await this.taxProviderService_
        .withTransaction(this.activeManager_)
        .getTaxLinesMap(cartItems, calculationContext)

      cartItems.forEach((item) => {
        if (item.is_return) {
          return
        }
        item.tax_lines = taxLinesMaps.lineItemsTaxLines[item.id] ?? []
      })
      cartShippingMethods.forEach((method) => {
        method.tax_lines = taxLinesMaps.shippingMethodsTaxLines[method.id] ?? []
      })
    }

    const itemsTotals = await newTotalsServiceTx.getLineItemTotals(cartItems, {
      includeTax,
      calculationContext,
    })
    const shippingTotals = await newTotalsServiceTx.getShippingMethodTotals(
      cartShippingMethods,
      {
        discounts: cart.discounts,
        includeTax,
        calculationContext,
      }
    )

    cart.subtotal = 0
    cart.discount_total = 0
    cart.item_tax_total = 0
    cart.shipping_total = 0
    cart.shipping_tax_total = 0

    cart.items = (cart.items || []).map((item) => {
      const itemWithTotals = Object.assign(item, itemsTotals[item.id] ?? {})

      cart.subtotal! += itemWithTotals.subtotal ?? 0
      cart.discount_total! += itemWithTotals.raw_discount_total ?? 0
      cart.item_tax_total! += itemWithTotals.tax_total ?? 0

      return itemWithTotals
    })

    cart.shipping_methods = (cart.shipping_methods || []).map(
      (shippingMethod) => {
        const methodWithTotals = Object.assign(
          shippingMethod,
          shippingTotals[shippingMethod.id] ?? {}
        )

        cart.shipping_total! += methodWithTotals.subtotal ?? 0
        cart.shipping_tax_total! += methodWithTotals.tax_total ?? 0

        return methodWithTotals
      }
    )

    cart.tax_total = cart.item_tax_total + cart.shipping_tax_total

    cart.raw_discount_total = cart.discount_total
    cart.discount_total = Math.round(cart.discount_total)

    const giftCardableAmount = this.newTotalsService_.getGiftCardableAmount({
      gift_cards_taxable: cart.region?.gift_cards_taxable,
      subtotal: cart.subtotal,
      discount_total: cart.discount_total,
      shipping_total: cart.shipping_total,
      tax_total: cart.tax_total,
    })

    const giftCardTotal = await this.newTotalsService_.getGiftCardTotals(
      giftCardableAmount,
      {
        region: cart.region,
        giftCards: cart.gift_cards,
      }
    )

    cart.gift_card_total = giftCardTotal.total || 0
    cart.gift_card_tax_total = giftCardTotal.tax_total || 0

    /**
     * Handle store credits
     * todo: replace with super.decorateTotals() ?
     */

    // const [storeCredits] = await this.storeCreditService_.listAndCount();

    // const storeCreditableAmount = (this.newTotalsService_ as NewTotalsService).getStoreCreditableAmount({
    //   gift_cards_taxable: cart.region?.gift_cards_taxable,
    //   subtotal: cart.subtotal,
    //   discount_total: cart.discount_total,
    //   shipping_total: cart.shipping_total,
    //   tax_total: cart.tax_total,
    // });

    // const storeCreditTotal = await (this.newTotalsService_ as NewTotalsService).getStoreCreditTotals(
    //   storeCreditableAmount,
    //   {
    //     // region: cart.region,
    //     storeCredits: storeCredits,
    //   }
    // );

    // cart.store_credit_total = storeCreditTotal.total || 0;
    cart.store_credit_total = 0;

    cart.total =
      cart.subtotal +
      cart.shipping_total +
      cart.tax_total -
      (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total + cart.store_credit_total)

    return cart as Cart & { total: number }
  }
}

export default CartService;

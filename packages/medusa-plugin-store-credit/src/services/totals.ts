import {
  TotalsService as MedusaTotalsService,
  Cart,
  Order,
} from "@medusajs/medusa";

// import { isDefined, MedusaError } from "@medusajs/utils"
// import { EntityManager } from "typeorm"
// import {
//   ITaxCalculationStrategy,
//   TaxCalculationContext,
//   TransactionBaseService,
// } from "../interfaces"
// import {
//   Cart,
//   ClaimOrder,
//   Discount,
//   DiscountRuleType,
//   LineItem,
//   LineItemTaxLine,
//   Order,
//   ShippingMethod,
//   ShippingMethodTaxLine,
//   Swap,
// } from "../models"
// import { isCart } from "../types/cart"
// import { isOrder } from "../types/orders"
// import {
//   CalculationContextData,
//   LineAllocationsMap,
//   LineDiscount,
//   LineDiscountAmount,
//   SubtotalOptions,
// } from "../types/totals"
// import { NewTotalsService, TaxProviderService } from "./index"

// import { FlagRouter } from "@medusajs/utils"
// import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
// import { calculatePriceTaxAmount } from "../utils"

type GetTotalsOptions = {
  exclude_gift_cards?: boolean;
  force_taxes?: boolean;
};

class TotalsService extends MedusaTotalsService {
  // prettier-ignore
  /**
   * Calculates total of a given cart or order.
   * @param cartOrOrder - object to calculate total for
   * @param options - options to calculate by
   * @return the calculated subtotal
   */
  async getTotal(
    cartOrOrder: Cart | Order,
    options: GetTotalsOptions = {}
  ): Promise<number> {
    const subtotal = await this.getSubtotal(cartOrOrder);
    const taxTotal =
      (await this.getTaxTotal(cartOrOrder, options.force_taxes)) || 0;
    const discountTotal = await this.getDiscountTotal(cartOrOrder);
    const giftCardTotal = options.exclude_gift_cards
      ? { total: 0 }
      : await this.getGiftCardTotal(cartOrOrder);
    const shippingTotal = await this.getShippingTotal(cartOrOrder);

    const storeCreditTotal = await this.getStoreCreditTotal(cartOrOrder, giftCardTotal);

    return (
      subtotal + taxTotal + shippingTotal - discountTotal - giftCardTotal.total - storeCreditTotal.total
    );
  }

  /**
   * Gets the store credit amount on a cart or order.
   * @param cartOrOrder - the cart or order to get store credit amount for
   * @return the store credit amount applied to the cart or order
   */
  async getStoreCreditTotal(
    cartOrOrder: Cart | Order,
    giftCardTotal:
      | {
          total: number;
        }
      | {
          total: number;
          tax_total: number;
        }
  ): Promise<{
    total: number;
    // tax_total: number; // todo
  }> {
    let giftCardable: number;

    const subtotal = await this.getSubtotal(cartOrOrder);
    const discountTotal = await this.getDiscountTotal(cartOrOrder);

    // todo: subtract giftCardTotal.tax_total?
    giftCardable = subtotal - discountTotal - giftCardTotal.total;

    return await this.newTotalsService_.getGiftCardTotals(giftCardable, {
      region: cartOrOrder.region,
      giftCards: cartOrOrder.gift_cards || [],
      giftCardTransactions: cartOrOrder["gift_card_transactions"] || [],
    });
  }
}

export default TotalsService;

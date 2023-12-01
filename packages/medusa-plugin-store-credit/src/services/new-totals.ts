import { NewTotalsService as MedusaNewTotalsService } from "@medusajs/medusa";
import { StoreCredit } from "../models/store-credit";

// import { FlagRouter } from "@medusajs/utils"
// import { isDefined, MedusaError } from "medusa-core-utils"
// import { EntityManager } from "typeorm"
// import {
//   ITaxCalculationStrategy,
//   TaxCalculationContext,
//   TransactionBaseService,
// } from "../interfaces"
// import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
// import {
//   Discount,
//   DiscountRuleType,
//   GiftCard,
//   LineItem,
//   LineItemTaxLine,
//   Region,
//   ShippingMethod,
//   ShippingMethodTaxLine,
// } from "../models"
// import { LineAllocationsMap } from "../types/totals"
// import { calculatePriceTaxAmount } from "../utils"
// import { TaxProviderService } from "./index"

export default class NewTotalsService extends MedusaNewTotalsService {
  /**
   * Calculate and return the gift cards totals
   * @param giftCardableAmount
   * @param giftCardTransactions
   * @param region
   * @param giftCards
   */
  async getStoreCreditTotals(
    storeCreditableAmount: number,
    {
      // giftCardTransactions,
      // region,
      storeCredits,
    }: {
      // region: Region;
      // giftCardTransactions?: GiftCardTransaction[];
      storeCredits: StoreCredit[];
    }
  ): Promise<{
    total: number;
    // tax_total: number;
  }> {
    // if (!storeCredits/* && !giftCardTransactions*/) {
    //   throw new MedusaError(
    //     MedusaError.Types.UNEXPECTED_STATE,
    //     "Cannot calculate the gift cart totals. Neither the gift cards or gift card transactions have been provided"
    //   );
    // }

    // if (giftCardTransactions?.length) {
    //   return this.getGiftCardTransactionsTotals({
    //     giftCardTransactions,
    //     region,
    //   });
    // }

    const result = {
      total: 0,
      // tax_total: 0,
    };

    if (!storeCredits.length) {
      return result;
    }

    // If a gift card is not taxable, the tax_rate for the giftcard will be null
    const { totalStoreCreditBalance } = storeCredits.reduce(
      (acc, giftCard) => {
        acc.totalStoreCreditBalance += giftCard.balance;
        return acc;
      },
      {
        totalStoreCreditBalance: 0,
        giftCardableBalance: storeCreditableAmount,
      }
    );

    // result.tax_total = Math.round(totalTaxFromGiftCards);
    result.total = Math.min(storeCreditableAmount, totalStoreCreditBalance);

    return result;
  }

  /**
   * todo
   */
  getStoreCreditableAmount({
    gift_cards_taxable,
    subtotal,
    shipping_total,
    discount_total,
    tax_total,
  }: {
    gift_cards_taxable?: boolean;
    subtotal: number;
    shipping_total: number;
    discount_total: number;
    tax_total: number;
  }): number {
    return (
      (gift_cards_taxable
        ? subtotal + shipping_total - discount_total
        : subtotal + shipping_total + tax_total - discount_total) || 0
    );
  }
}

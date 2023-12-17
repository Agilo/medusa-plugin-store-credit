import {
  NewTotalsService as MedusaNewTotalsService,
  Region,
} from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import { StoreCredit } from "../models/store-credit";
import { StoreCreditTransaction } from "../models/store-credit-transaction";

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
      region,
      storeCredits,
      storeCreditTransactions,
    }: {
      region: Region;
      storeCredits?: StoreCredit[];
      storeCreditTransactions?: StoreCreditTransaction[];
    }
  ): Promise<{
    total: number;
    // tax_total: number;
  }> {
    if (!storeCredits && !storeCreditTransactions) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Cannot calculate the gift cart totals. Neither the gift cards or gift card transactions have been provided"
      );
    }

    if (storeCreditTransactions?.length) {
      // return this.getGiftCardTransactionsTotals({
      //   giftCardTransactions,
      //   region,
      // });
      return this.getStoreCreditTransactionsTotals({
        storeCreditTransactions,
        // region,
      });
    }

    const result = {
      total: 0,
      // tax_total: 0,
    };

    if (!storeCredits?.length) {
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

  // prettier-ignore
  /**
   * Calculate and return the store credits totals based on their transactions
   * todo: handle tax
   */
  getStoreCreditTransactionsTotals({
    storeCreditTransactions,
    // region,
  }: {
    storeCreditTransactions: StoreCreditTransaction[];
    // region: { store_credits_taxable: boolean; tax_rate: number };
  }): { total: number /*tax_total: number*/ } {
    return storeCreditTransactions.reduce(
      (acc, next) => {
        // let taxMultiplier = (next.tax_rate || 0) / 100

        // Previously we did not record whether a gift card was taxable or not.
        // All gift cards where is_taxable === null are from the old system,
        // where we defaulted to taxable gift cards.
        //
        // This is a backwards compatability fix for orders that were created
        // before we added the gift card tax rate.
        // We prioritize the giftCard.tax_rate as we create a snapshot of the tax
        // on order creation to create gift cards on the gift card itself.
        // If its created outside of the order, we refer to the region tax
        // if (next.is_taxable === null) {
        //   if (region?.gift_cards_taxable || next.gift_card?.tax_rate) {
        //     taxMultiplier = (next.gift_card?.tax_rate ?? region.tax_rate) / 100
        //   }
        // }

        return {
          total: acc.total + next.amount,
          // tax_total: Math.round(acc.tax_total + next.amount * taxMultiplier),
        };
      },
      {
        total: 0,
        // tax_total: 0,
      }
    );
  }

  /**
   * todo
   */
  getStoreCreditableAmount({
    // gift_cards_taxable,
    subtotal,
    shipping_total,
    discount_total,
    tax_total,
    gift_card_total,
    gift_card_tax_total,
  }: {
    // gift_cards_taxable?: boolean;
    subtotal: number;
    shipping_total: number;
    discount_total: number;
    tax_total: number;
    gift_card_total: number;
    gift_card_tax_total: number;
  }): number {
    return (
      // (gift_cards_taxable
      //   ? subtotal + shipping_total - (discount_total + gift_card_total + gift_card_tax_total)
      //   : subtotal + shipping_total + tax_total - (discount_total + gift_card_total + gift_card_tax_total)) || 0
      subtotal +
      shipping_total +
      tax_total -
      (discount_total + gift_card_total + gift_card_tax_total)
    );
  }
}

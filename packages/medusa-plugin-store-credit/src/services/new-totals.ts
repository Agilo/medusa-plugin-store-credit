import { NewTotalsService as MedusaNewTotalsService } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import { StoreCredit } from "../models/store-credit";
import { StoreCreditTransaction } from "../models/store-credit-transaction";

export default class NewTotalsService extends MedusaNewTotalsService {
  /**
   * Calculate and return the store credit totals
   */
  getStoreCreditTotals(
    storeCreditableAmount: number,
    {
      storeCredits,
      storeCreditTransactions,
    }: {
      storeCredits?: StoreCredit[];
      storeCreditTransactions?: StoreCreditTransaction[];
    }
  ): number {
    if (!storeCredits && !storeCreditTransactions) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Cannot calculate the store credit totals. Neither the store credit or store credit transactions have been provided"
      );
    }

    if (storeCreditTransactions?.length) {
      return this.getStoreCreditTransactionsTotals(storeCreditTransactions);
    }

    let totals = 0;

    if (!storeCredits?.length) {
      return totals;
    }

    // If a gift card is not taxable, the tax_rate for the giftcard will be null
    totals = storeCredits.reduce((acc, storeCredit) => {
      return acc + storeCredit.balance;
    }, 0);

    return Math.min(storeCreditableAmount, totals);
  }

  /**
   * Calculate and return the store credits totals based on their transactions
   */
  getStoreCreditTransactionsTotals(
    storeCreditTransactions: StoreCreditTransaction[]
  ): number {
    return storeCreditTransactions.reduce((acc, storeCreditTransaction) => {
      return acc + storeCreditTransaction.amount;
    }, 0);
  }

  getStoreCreditableAmount(total: number): number {
    return total;
  }
}

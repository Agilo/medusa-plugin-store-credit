/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Merge, SetRelation } from "../core/ModelUtils";

import type { Order as MedusaOrder } from "@medusajs/medusa";
import type { StoreCredit } from "./StoreCredit";
import type { StoreCreditTransaction } from "./StoreCreditTransaction";

/**
 * A bundle is a group of products.
 */
export interface Order extends MedusaOrder {
  /**
   * Store credits.
   */
  store_credits?: Array<StoreCredit>;
  /**
   * Store credit transactions.
   */
  store_credit_transactions?: Array<StoreCreditTransaction>;
  /**
   * Store credit total.
   */
  store_credit_total?: number | null;
}

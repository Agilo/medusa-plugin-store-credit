/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Order } from '@medusajs/medusa';
import type { StoreCredit } from './StoreCredit';

/**
 * Store Credit Transactions are created once a Customer uses Store Credit to pay for their Order.
 */
export interface StoreCreditTransaction {
  /**
   * The store credit transaction's ID
   */
  id: string;
  /**
   * The ID of the Store Credit that was used in the transaction.
   */
  store_credit_id: string;
  /**
   * The details of the store credit associated used in this transaction.
   */
  store_credit?: StoreCredit | null;
  /**
   * The ID of the order that the store credit was used for payment.
   */
  order_id: string;
  /**
   * The details of the order that the store credit was used for payment.
   */
  order?: Order | null;
  /**
   * The amount that was used from the Store Credit.
   */
  amount: number;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string;
};



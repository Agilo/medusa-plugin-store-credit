/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Customer } from '@medusajs/medusa';
import type { Region } from '@medusajs/medusa';
import type { StoreCreditTransaction } from './StoreCreditTransaction';

/**
 * Store credit.
 */
export interface StoreCredit {
  /**
   * The store credit's ID
   */
  id: string;
  /**
   * Original store credit value.
   */
  value: number;
  /**
   * Current store credit value.
   */
  balance: number;
  /**
   * A short description of the Store Credit.
   */
  description: string | null;
  /**
   * The store credit transactions made in the order.
   */
  store_credit_transactions?: Array<StoreCreditTransaction>;
  /**
   * The ID of the region this store credit was created in.
   */
  region_id: string;
  /**
   * The details of the region this store credit was created in.
   */
  region: Region | null;
  /**
   * The ID of the customer associated with the store credit.
   */
  customer_id: string;
  /**
   * The details of the customer associated with the store credit.
   */
  customer: Customer | null;
  /**
   * Whether the Store Credit has been disabled. Disabled Store Credits cannot be applied to carts.
   */
  is_disabled: boolean;
  /**
   * The time at which the Store Credit can no longer be used.
   */
  ends_at: string | null;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null;
};



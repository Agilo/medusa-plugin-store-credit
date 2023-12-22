/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminPostStoreCreditsReq {
  /**
   * The value (excluding VAT) that the Store Credit should represent.
   */
  value: number;
  /**
   * The date and time at which the Store Credit should no longer be available.
   */
  ends_at?: string;
  /**
   * Whether the Store Credit is disabled on creation.
   */
  is_disabled?: boolean;
  /**
   * The ID of the Region in which the Store Credit can be used.
   */
  region_id: string;
  /**
   * The ID of the customer this Store Credit is associated with.
   */
  customer_id: string;
  /**
   * The description of the Store Credit.
   */
  description?: string;
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>;
};



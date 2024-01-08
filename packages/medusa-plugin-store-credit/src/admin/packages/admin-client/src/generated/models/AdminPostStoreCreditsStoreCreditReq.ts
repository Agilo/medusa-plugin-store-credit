/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminPostStoreCreditsStoreCreditReq {
  /**
   * Balance (excluding VAT) that the Store Credit should represent, can't be greater than original amount.
   */
  balance?: number;
  /**
   * The date and time at which the Store Credit should no longer be available.
   */
  ends_at?: string;
  /**
   * Whether the Store Credit is disabled.
   */
  is_disabled?: boolean;
  /**
   * The description of the Store Credit.
   */
  description?: string;
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>;
};



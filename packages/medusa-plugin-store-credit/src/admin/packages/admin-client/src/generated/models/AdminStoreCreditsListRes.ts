/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { StoreCredit } from './StoreCredit';

export interface AdminStoreCreditsListRes {
  /**
   * An array of Store Credit details.
   */
  store_credits: Array<SetRelation<StoreCredit, 'customer' | 'region'>>;
  /**
   * The total number of items available
   */
  count: number;
  /**
   * The number of store credits skipped.
   */
  offset: number;
  /**
   * The number of items per page
   */
  limit: number;
};



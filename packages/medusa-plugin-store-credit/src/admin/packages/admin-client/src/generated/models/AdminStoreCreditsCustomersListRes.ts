/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { StoreCreditCustomer } from './StoreCreditCustomer';

export interface AdminStoreCreditsCustomersListRes {
  /**
   * An array of Store Credit Customer details.
   */
  customers: Array<SetRelation<StoreCreditCustomer, 'customer' | 'region'>>;
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



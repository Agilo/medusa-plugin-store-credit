/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminGetStoreCreditTransactionsParams {
  /**
   * The number of store credits to skip when retrieving the store credits.
   */
  offset?: number;
  /**
   * Limit the number of store credits returned.
   */
  limit?: number;
  /**
   * Filter by customer.
   */
  store_credit_id?: string;
};



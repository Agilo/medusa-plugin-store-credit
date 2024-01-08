/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminGetStoreCreditsParams {
  /**
   * The number of store credits to skip when retrieving the store credits.
   */
  offset?: number;
  /**
   * Limit the number of store credits returned.
   */
  limit?: number;
  /**
   * Comma-separated relations that should be expanded.
   */
  expand?: string;
  /**
   * Comma-separated fields that should be included.
   */
  fields?: string;
  /**
   * Filter by customer.
   */
  customer_id?: string;
  /**
   * Filter by region.
   */
  region_id?: string;
};



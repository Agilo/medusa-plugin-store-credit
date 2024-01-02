/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminGetStoreCreditsCustomersParams {
  /**
   * term to search customers' email, first name and last name.
   */
  'q'?: string;
  /**
   * The number of customers to skip when retrieving the customers.
   */
  offset?: number;
  /**
   * Limit the number of customers returned.
   */
  limit?: number;
};



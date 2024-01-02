/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Customer } from './Customer';
import type { Region } from './Region';

/**
 * Store credit customer.
 */
export interface StoreCreditCustomer {
  /**
   * The details of the customer associated with the store credit.
   */
  customer: Customer | null;
  /**
   * The details of the region this store credit was created in.
   */
  region: Region | null;
  /**
   * Original store credit value.
   */
  value?: number;
  /**
   * Current store credit value.
   */
  balance: number;
};



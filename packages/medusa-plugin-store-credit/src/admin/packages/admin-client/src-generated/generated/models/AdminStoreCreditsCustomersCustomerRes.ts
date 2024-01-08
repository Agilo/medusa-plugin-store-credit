/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { StoreCreditCustomer } from './StoreCreditCustomer';

export interface AdminStoreCreditsCustomersCustomerRes {
  /**
   * Store Credit Customer.
   */
  customer: SetRelation<StoreCreditCustomer, 'customer' | 'region'>;
};



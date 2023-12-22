/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { StoreCredit } from './StoreCredit';

export interface AdminStoreCreditsRes {
  /**
   * Store Credit details.
   */
  store_credit: SetRelation<StoreCredit, 'customer' | 'region'>;
};



/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { ProductOption } from './ProductOption';
import type { ProductVariant } from './ProductVariant';

/**
 * An option value is one of the possible values of a Product Option. Product Variants specify a unique combination of product option values.
 */
export interface ProductOptionValue {
  /**
   * The product option value's ID
   */
  id: string;
  /**
   * The value that the Product Variant has defined for the specific Product Option (e.g. if the Product Option is "Size" this value could be `Small`, `Medium` or `Large`).
   */
  value: string;
  /**
   * The ID of the Product Option that the Product Option Value belongs to.
   */
  option_id: string;
  /**
   * The details of the product option that the Product Option Value belongs to.
   */
  option?: ProductOption | null;
  /**
   * The ID of the product variant that uses this product option value.
   */
  variant_id: string;
  /**
   * The details of the product variant that uses this product option value.
   */
  variant?: ProductVariant | null;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null;
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null;
};



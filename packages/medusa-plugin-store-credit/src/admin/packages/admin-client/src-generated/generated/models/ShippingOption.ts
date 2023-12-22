/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { FulfillmentProvider } from './FulfillmentProvider';
import type { Region } from './Region';
import type { ShippingOptionRequirement } from './ShippingOptionRequirement';
import type { ShippingProfile } from './ShippingProfile';

/**
 * A Shipping Option represents a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information.
 */
export interface ShippingOption {
  /**
   * The shipping option's ID
   */
  id: string;
  /**
   * The name given to the Shipping Option - this may be displayed to the Customer.
   */
  name: string;
  /**
   * The ID of the region this shipping option can be used in.
   */
  region_id: string;
  /**
   * The details of the region this shipping option can be used in.
   */
  region?: Region | null;
  /**
   * The ID of the Shipping Profile that the shipping option belongs to.
   */
  profile_id: string;
  /**
   * The details of the shipping profile that the shipping option belongs to.
   */
  profile?: ShippingProfile | null;
  /**
   * The ID of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.
   */
  provider_id: string;
  /**
   * The details of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.
   */
  provider?: FulfillmentProvider | null;
  /**
   * The type of pricing calculation that is used when creatin Shipping Methods from the Shipping Option. Can be `flat_rate` for fixed prices or `calculated` if the Fulfillment Provider can provide price calulations.
   */
  price_type: 'flat_rate' | 'calculated';
  /**
   * The amount to charge for shipping when the Shipping Option price type is `flat_rate`.
   */
  amount: number | null;
  /**
   * Flag to indicate if the Shipping Option can be used for Return shipments.
   */
  is_return: boolean;
  /**
   * Flag to indicate if the Shipping Option usage is restricted to admin users.
   */
  admin_only: boolean;
  /**
   * The details of the requirements that must be satisfied for the Shipping Option to be available for usage in a Cart.
   */
  requirements?: Array<ShippingOptionRequirement>;
  /**
   * The data needed for the Fulfillment Provider to identify the Shipping Option.
   */
  data: Record<string, any>;
  /**
   * Whether the shipping option price include tax
   */
  includes_tax?: boolean;
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



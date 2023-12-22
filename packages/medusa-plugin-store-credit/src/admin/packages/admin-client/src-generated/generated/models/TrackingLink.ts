/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Fulfillment } from './Fulfillment';

/**
 * A tracking link holds information about tracking numbers for a Fulfillment. Tracking Links can optionally contain a URL that can be visited to see the status of the shipment. Typically, the tracking link is provided from the third-party service integrated through the used fulfillment provider.
 */
export interface TrackingLink {
  /**
   * The tracking link's ID
   */
  id: string;
  /**
   * The URL at which the status of the shipment can be tracked.
   */
  url: string | null;
  /**
   * The tracking number given by the shipping carrier.
   */
  tracking_number: string;
  /**
   * The ID of the fulfillment that the tracking link belongs to.
   */
  fulfillment_id: string;
  /**
   * The details of the fulfillment that the tracking link belongs to.
   */
  fulfillment?: Fulfillment | null;
  /**
   * Randomly generated key used to continue the completion of a process in case of failure.
   */
  idempotency_key: string | null;
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



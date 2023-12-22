/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * An Image is used to store details about uploaded images. Images are uploaded by the File Service, and the URL is provided by the File Service.
 */
export interface Image {
  /**
   * The image's ID
   */
  id: string;
  /**
   * The URL at which the image file can be found.
   */
  url: string;
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



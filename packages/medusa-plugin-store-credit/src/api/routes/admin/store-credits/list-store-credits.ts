import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [get] /admin/store-credits
 * operationId: AdminGetStoreCredits
 * summary: List Store Credits
 * description: |
 *   Retrieves a list of store credits.
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {integer} The number of store credits to skip when retrieving the store credits.
 *   - (query) limit=10 {integer} Limit the number of store credits returned.
 *   - (query) expand {string} Comma-separated relations that should be expanded.
 *   - (query) fields {string} Comma-separated fields that should be included.
 *   - (query) customer_id {string} Filter by customer.
 *   - (query) region_id {string} Filter by region.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetStoreCreditsParams
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - StoreCredits
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStoreCreditsListRes"
 */
export default async (req, res) => {
  const { skip, take } = req.listConfig;

  const storeCreditService: StoreCreditService =
    req.scope.resolve("storeCreditService");

  const [store_credits, count] = await storeCreditService.listAndCount(
    req.filterableFields,
    req.listConfig
  );

  res.json({
    store_credits,
    count,
    offset: skip,
    limit: take,
  });
};

export class AdminGetStoreCreditsParams {
  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsString()
  @IsOptional()
  expand?: string;

  /**
   * {@inheritDoc FindParams.fields}
   */
  @IsString()
  @IsOptional()
  fields?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => String)
  customer_id?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => String)
  region_id?: string;
}

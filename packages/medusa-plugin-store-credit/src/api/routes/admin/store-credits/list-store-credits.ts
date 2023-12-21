import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [get] /admin/store-credits
 * operationId: AdminGetStoreCredits
 * summary: List Store Credits
 * description: |
 *   Retrieves a list of store credits.
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {integer} The number of bundles to skip when retrieving the bundles.
 *   - (query) limit=10 {integer} Limit the number of bundles returned.
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
  // @IsString()
  // @IsOptional()
  // @Type(() => String)
  // q?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  // @IsString()
  // @IsOptional()
  // @IsNotEmpty()
  // @Type(() => String)
  // product_id?: string;
}

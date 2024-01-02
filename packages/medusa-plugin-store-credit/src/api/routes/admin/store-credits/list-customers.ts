import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [get] /admin/store-credits/customers
 * operationId: AdminGetStoreCreditsCustomers
 * summary: List Store Credit Customers
 * description: |
 *   Retrieve a list of Store Credit Customers.
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} term to search customers' email, first name and last name.
 *   - (query) offset=0 {integer} The number of customers to skip when retrieving the customers.
 *   - (query) limit=10 {integer} Limit the number of customers returned.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetStoreCreditsCustomersParams
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
 *           $ref: "#/components/schemas/AdminStoreCreditsCustomersListRes"
 */
export default async (req, res) => {
  const { skip, take } = req.listConfig;

  const storeCreditService: StoreCreditService =
    req.scope.resolve("storeCreditService");

  const [customers, count] = await storeCreditService.listAndCountCustomers(
    req.filterableFields,
    req.listConfig
  );

  res.json({
    customers,
    count,
    offset: skip,
    limit: take,
  });
};

export class AdminGetStoreCreditsCustomersParams {
  @IsString()
  @IsOptional()
  @Type(() => String)
  q?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

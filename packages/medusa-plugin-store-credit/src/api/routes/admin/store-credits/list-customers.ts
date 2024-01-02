import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [get] /admin/store-credits/customers
 * operationId: "AdminGetStoreCreditsCustomers"
 * summary: "List Store Credit Customers"
 * description: "Retrieve a list of Store Credit Customers."
 * x-authenticated: true
 * x-codegen:
 *   method: listCustomers
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - StoreCredits
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

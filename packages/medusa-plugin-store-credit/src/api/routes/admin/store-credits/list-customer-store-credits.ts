import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import StoreCreditCustomerService from "../../../../services/store-credit-customer";

/**
 * @oas [get] /admin/store-credits/customers/{id}/store-credits
 * operationId: AdminGetStoreCreditsCustomersCustomerStoreCredits
 * summary: List Store Credit Customers
 * description: |
 *   Retrieve a list of Store Credit Customers.
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the customer.
 *   - (query) q {string} term to search customers' email, first name and last name.
 *   - (query) offset=0 {integer} The number of customers to skip when retrieving the customers.
 *   - (query) limit=10 {integer} Limit the number of customers returned.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetStoreCreditsCustomersCustomerStoreCreditsParams
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
 *           $ref: "#/components/schemas/AdminStoreCreditsCustomersCustomerStoreCreditsListRes"
 */
export default async (req, res) => {
  const { id } = req.params;
  const { skip, take } = req.listConfig;

  const storeCreditCustomerService: StoreCreditCustomerService =
    req.scope.resolve("storeCreditCustomerService");

  const [store_credits, count] =
    await storeCreditCustomerService.listAndCountStoreCredits(
      { customer_id: id },
      req.listConfig
    );

  res.json({
    store_credits,
    count,
    offset: skip,
    limit: take,
  });
};

export class AdminGetStoreCreditsCustomersCustomerStoreCreditsParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [get] /admin/store-credit-transactions
 * operationId: AdminGetStoreCreditTransactions
 * summary: List Store Credit Transactions
 * description: |
 *   Retrieves a list of store credit transactions.
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {integer} The number of store credits to skip when retrieving the store credits.
 *   - (query) limit=10 {integer} Limit the number of store credits returned.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetStoreCreditTransactionsParams
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
 *           $ref: "#/components/schemas/AdminStoreCreditTransactionsListRes"
 */
export default async (req, res) => {
  const { skip, take } = req.listConfig;

  const storeCreditService: StoreCreditService =
    req.scope.resolve("storeCreditService");

  const [store_credit_transactions, count] =
    await storeCreditService.listAndCount(req.filterableFields, req.listConfig);

  res.json({
    store_credit_transactions,
    count,
    offset: skip,
    limit: take,
  });
};

export class AdminGetStoreCreditTransactionsParams {
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

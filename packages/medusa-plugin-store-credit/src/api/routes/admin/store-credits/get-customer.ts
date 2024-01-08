import { FindParams } from "@medusajs/medusa";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import StoreCreditCustomerService from "src/services/store-credit-customer";

/**
 * @oas [get] /admin/store-credits/customers/{id}
 * operationId: "AdminGetStoreCreditsCustomersCustomer"
 * summary: "Get Store Credit"
 * description: "Retrieve Store Credit's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Store Credit.
 * x-codegen:
 *   method: retrieve
 *   queryParams: AdminGetStoreCreditsCustomersCustomerParams
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
 *           $ref: "#/components/schemas/AdminStoreCreditsCustomersCustomerRes"
 */
export default async (req, res) => {
  const { id } = req.params;
  const storeCreditCustomerService: StoreCreditCustomerService =
    req.scope.resolve("storeCreditCustomerService");

  // console.log("req", req);
  // console.log("req.filterableFields", req.filterableFields);
  // console.log("req.listConfig", req.listConfig);
  // console.log("req.retrieveConfig", req.retrieveConfig);

  const customer = await storeCreditCustomerService.retrieve(
    id,
    req.filterableFields.region_id
  );
  res.json({ customer });
};

/**
 * TODO: is there a way to only require region_id and to not use FindParams here?
 * transformQuery requires something like FindParams to work.
 */
export class AdminGetStoreCreditsCustomersCustomerParams extends FindParams {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  region_id: string;
}

import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [get] /admin/store-credits/{id}
 * operationId: "AdminGetStoreCreditsStoreCredit"
 * summary: "Get Store Credit"
 * description: "Retrieve Store Credit's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Store Credit.
 * x-codegen:
 *   method: retrieve
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
 *           $ref: "#/components/schemas/AdminStoreCreditsRes"
 */
export default async (req, res) => {
  const { id } = req.params;
  const storeCreditService: StoreCreditService =
    req.scope.resolve("storeCreditService");
  const storeCredit = await storeCreditService.retrieve(id);
  res.json({ store_credit: storeCredit });
};

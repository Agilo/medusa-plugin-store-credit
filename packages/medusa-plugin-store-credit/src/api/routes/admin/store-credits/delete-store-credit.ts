import { EntityManager } from "typeorm";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [delete] /admin/store-credits/{id}
 * operationId: "AdminDeleteStoreCreditsStoreCredit"
 * summary: "Delete Store Credit"
 * description: "Delete Store Credit."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Store Credit.
 * x-codegen:
 *   method: delete
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
 *           $ref: "#/components/schemas/AdminStoreCreditsDeleteRes"
 */
export default async (req, res) => {
  const { id } = req.params;

  const storeCreditService: StoreCreditService =
    req.scope.resolve("storeCreditService");
  const manager: EntityManager = req.scope.resolve("manager");

  // todo: make sure this is soft deleted
  await manager.transaction(async (transactionManager) => {
    return await storeCreditService
      .withTransaction(transactionManager)
      .delete(id);
  });

  res.json({
    id,
    object: "store_credit",
    deleted: true,
  });
};

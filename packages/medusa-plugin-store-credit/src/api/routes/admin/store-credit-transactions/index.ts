import {
  PaginatedResponse,
  authenticate,
  transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
import cors from "cors";
import { Router } from "express";
import { parseCorsOrigins } from "medusa-core-utils";
import { StoreCredit } from "../../../../models/store-credit";
import { AdminGetStoreCreditTransactionsParams } from "./list-store-credit-transactions";

export default function adminRoutes(router: Router, admin_cors: string) {
  const adminRouter = Router();

  router.use("/admin/store-credit-transactions", adminRouter);

  adminRouter.use(
    cors({
      origin: parseCorsOrigins(admin_cors),
      credentials: true,
    })
  );
  adminRouter.use(authenticate());

  adminRouter.get(
    "/",
    transformQuery(AdminGetStoreCreditTransactionsParams, {
      isList: true,
    }),
    wrapHandler(require("./list-store-credit-transactions").default)
  );
}

/**
 * @schema AdminStoreCreditTransactionsListRes
 * type: object
 * x-expanded-relations:
 *   field: store_credit_transactions
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - store_credit_transactions
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   store_credit_transactions:
 *     type: array
 *     description: An array of Store Credit details.
 *     items:
 *       $ref: "#/components/schemas/StoreCredit"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of store credits skipped.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminStoreCreditTransactionsListRes = PaginatedResponse & {
  store_credit_transactions: StoreCredit[];
};

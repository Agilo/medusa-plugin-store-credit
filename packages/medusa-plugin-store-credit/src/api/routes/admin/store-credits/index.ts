import {
  Customer,
  PaginatedResponse,
  Region,
  authenticate,
  transformBody,
  transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
import cors from "cors";
import { Router } from "express";
import { parseCorsOrigins } from "medusa-core-utils";
import { StoreCredit } from "../../../../models/store-credit";
import { AdminPostStoreCreditsReq } from "./create-store-credit";
import { AdminGetStoreCreditsCustomersCustomerParams } from "./get-customer";
import { AdminGetStoreCreditParams } from "./get-store-credit";
import { AdminGetStoreCreditsCustomersCustomerStoreCreditsParams } from "./list-customer-store-credits";
import { AdminGetStoreCreditsCustomersParams } from "./list-customers";
import { AdminGetStoreCreditsParams } from "./list-store-credits";
import { AdminPostStoreCreditsStoreCreditReq } from "./update-store-credit";

export default function adminRoutes(router: Router, admin_cors: string) {
  const adminRouter = Router();

  router.use("/admin/store-credits", adminRouter);

  adminRouter.use(
    cors({
      origin: parseCorsOrigins(admin_cors),
      credentials: true,
    }),
  );
  adminRouter.use(authenticate());

  adminRouter.get(
    "/",
    transformQuery(AdminGetStoreCreditsParams, {
      isList: true,
    }),
    wrapHandler(require("./list-store-credits").default),
  );

  adminRouter.post(
    "/",
    transformBody(AdminPostStoreCreditsReq),
    wrapHandler(require("./create-store-credit").default),
  );

  adminRouter.post(
    "/:id",
    transformBody(AdminPostStoreCreditsStoreCreditReq),
    wrapHandler(require("./update-store-credit").default),
  );

  adminRouter.get(
    "/customers",
    transformQuery(AdminGetStoreCreditsCustomersParams, {
      isList: true,
    }),
    wrapHandler(require("./list-customers").default),
  );

  adminRouter.get(
    "/customers/:id",
    transformQuery(AdminGetStoreCreditsCustomersCustomerParams, {
      isList: false,
    }),
    wrapHandler(require("./get-customer").default),
  );

  adminRouter.get(
    "/customers/:id/store-credits",
    transformQuery(AdminGetStoreCreditsCustomersCustomerStoreCreditsParams, {
      isList: true,
      defaultRelations: ["region"],
    }),
    wrapHandler(require("./list-customer-store-credits").default),
  );

  adminRouter.get(
    "/:id",
    transformQuery(AdminGetStoreCreditParams, {
      // defaultRelations: ["store_credit_transactions"],
      isList: false,
    }),
    wrapHandler(require("./get-store-credit").default),
  );

  adminRouter.delete(
    "/:id",
    wrapHandler(require("./delete-store-credit").default),
  );
}

/**
 * @schema AdminStoreCreditsRes
 * type: object
 * x-expanded-relations:
 *   field: store_credit
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - store_credit
 * properties:
 *   store_credit:
 *     description: Store Credit details.
 *     $ref: "#/components/schemas/StoreCredit"
 */
export type AdminStoreCreditsRes = {
  store_credit: StoreCredit;
};

/**
 * @schema AdminStoreCreditsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Store Credit.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: store_credit
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminStoreCreditsDeleteRes = {
  id: string;
  object: "store_credit";
  deleted: boolean;
};

/**
 * @schema AdminStoreCreditsListRes
 * type: object
 * x-expanded-relations:
 *   field: store_credits
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - store_credits
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   store_credits:
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
export type AdminStoreCreditsListRes = PaginatedResponse & {
  store_credits: StoreCredit[];
};

/**
 * @schema AdminStoreCreditsCustomersListRes
 * type: object
 * x-expanded-relations:
 *   field: customers
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - customers
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   customers:
 *     type: array
 *     description: An array of Store Credit Customer details.
 *     items:
 *       $ref: "#/components/schemas/StoreCreditCustomer"
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
export type AdminStoreCreditsCustomersListRes = PaginatedResponse & {
  customers: {
    customer: Customer;
    region: Region;
    amount: number;
    balance: number;
  }[];
};

/**
 * @schema AdminStoreCreditsCustomersCustomerRes
 * type: object
 * x-expanded-relations:
 *   field: customer
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - customer
 * properties:
 *   customer:
 *     description: Store Credit Customer.
 *     $ref: "#/components/schemas/StoreCreditCustomer"
 */
export type AdminStoreCreditsCustomersCustomerRes = {
  customer: {
    customer: Customer;
    region: Region;
    amount: number;
    balance: number;
  }[];
};

/**
 * @schema StoreCreditCustomer
 * title: "StoreCreditCustomer"
 * description: "Store credit customer."
 * type: object
 * required:
 *   - customer
 *   - region
 *   - value
 *   - balance
 * properties:
 *   customer:
 *     description: The details of the customer associated with the store credit.
 *     x-expandable: "customer"
 *     nullable: true
 *     $ref: "#/components/schemas/Customer"
 *   region:
 *     description: The details of the region this store credit was created in.
 *     x-expandable: "region"
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   value:
 *     description: Original store credit value.
 *     type: number
 *     example: 1000
 *   balance:
 *     description: Current store credit value.
 *     type: number
 *     example: 500
 */

/**
 * @schema AdminStoreCreditsCustomersCustomerStoreCreditsListRes
 * type: object
 * required:
 *   - store_credits
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   store_credits:
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
export type AdminStoreCreditsCustomersCustomerStoreCreditsListRes =
  PaginatedResponse & {
    store_credits: StoreCredit[];
  };

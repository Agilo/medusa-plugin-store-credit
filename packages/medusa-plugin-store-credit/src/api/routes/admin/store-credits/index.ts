import {
  // PaginatedResponse,
  // Product,
  authenticate,
  // defaultAdminProductFields,
  // defaultAdminProductRelations,
  transformBody,
  transformQuery,
  // transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
// import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import cors from "cors";
import { Router } from "express";
import { parseCorsOrigins } from "medusa-core-utils";
// import { Bundle } from "../../../../models/bundle";
// import { AdminPostProductsToBundleReq } from "./add-products";
import { AdminPostStoreCreditsReq } from "./create-store-credit";
import { AdminGetStoreCreditsParams } from "./list-store-credits";
// import { AdminGetBundlesBundleProductsParams } from "./list-products";
// import { AdminDeleteProductsFromBundleReq } from "./remove-products";
import { AdminPostStoreCreditsStoreCreditReq } from "./update-store-credit";

export default function adminRoutes(router: Router, admin_cors: string) {
  const adminRouter = Router();

  router.use("/admin/store-credits", adminRouter);

  adminRouter.use(
    cors({
      origin: parseCorsOrigins(admin_cors),
      credentials: true,
    })
  );
  adminRouter.use(authenticate());

  adminRouter.get(
    "/",
    transformQuery(AdminGetStoreCreditsParams, {
      isList: true,
    }),
    wrapHandler(require("./list-store-credits").default)
  );

  adminRouter.post(
    "/",
    transformBody(AdminPostStoreCreditsReq),
    wrapHandler(require("./create-store-credit").default)
  );

  adminRouter.post(
    "/:id",
    transformBody(AdminPostStoreCreditsStoreCreditReq),
    wrapHandler(require("./update-store-credit").default)
  );

  adminRouter.get("/:id", wrapHandler(require("./get-store-credit").default));

  adminRouter.delete(
    "/:id",
    wrapHandler(require("./delete-store-credit").default)
  );

  // adminRouter.post(
  //   "/:id/products/batch",
  //   transformBody(AdminPostProductsToBundleReq),
  //   wrapHandler(require("./add-products").default)
  // );

  // adminRouter.get(
  //   "/:id/products",
  //   transformQuery(AdminGetBundlesBundleProductsParams, {
  //     defaultRelations: defaultAdminProductRelations,
  //     defaultFields: defaultAdminProductFields,
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-products").default)
  // );

  // adminRouter.delete(
  //   "/:id/products/batch",
  //   transformBody(AdminDeleteProductsFromBundleReq),
  //   wrapHandler(require("./remove-products").default)
  // );
}

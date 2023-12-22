// import {
//   PaginatedResponse,
//   allowedStoreProductsFields,
//   allowedStoreProductsRelations,
//   defaultStoreProductsFields,
//   defaultStoreProductsRelations,
//   transformStoreQuery,
//   wrapHandler,
// } from "@medusajs/medusa";
import cors from "cors";
import { Router } from "express";
import { parseCorsOrigins } from "medusa-core-utils";
// import { Bundle } from "../../../../models/bundle";
// import { StoreGetBundlesParams } from "./list-bundles";
// import { StoreGetBundlesBundleProductsParams } from "./list-products";
// import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";

export default function storeRoutes(router: Router, store_cors: string) {
  const storeRouter = Router();

  router.use("/store/store-credits", storeRouter);

  storeRouter.use(
    cors({
      origin: parseCorsOrigins(store_cors),
      credentials: true,
    })
  );

  // storeRouter.get(
  //   "/",
  //   transformStoreQuery(StoreGetBundlesParams, {
  //     // defaultRelations: defaultStoreBundlesRelations,
  //     // defaultFields: defaultStoreBundlesFields,
  //     // allowedRelations: allowedStoreBundlesRelations,
  //     // allowedFields: allowedStoreBundlesFields,
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-bundles").default)
  // );

  // storeRouter.get("/:id", wrapHandler(require("./get-bundle").default));

  // storeRouter.get(
  //   "/:id/products",
  //   transformStoreQuery(StoreGetBundlesBundleProductsParams, {
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-products").default)
  // );

  // storeRouter.get(
  //   "/:id/products",
  //   // withDefaultSalesChannel({ attachChannelAsArray: true }),
  //   transformStoreQuery(StoreGetBundlesBundleProductsParams, {
  //     defaultRelations: defaultStoreProductsRelations,
  //     defaultFields: defaultStoreProductsFields,
  //     allowedFields: allowedStoreProductsFields,
  //     allowedRelations: allowedStoreProductsRelations,
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-products").default)
  // );

  // storeRouter.get(
  //   "/:id/products2",
  //   transformStoreQuery(StoreGetBundlesBundleProducts2Params, {
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-products2").default)
  // );
}

export default async function () {
  const adminImports = (await import(
    "@medusajs/medusa/dist/types/orders"
  )) as any;
  adminImports.defaultAdminOrdersRelations = [
    ...adminImports.defaultAdminOrdersRelations,
    "store_credits",
    "store_credit_transactions",
  ];

  const storeImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/orders/index"
  )) as any;
  storeImports.allowedStoreOrdersFields = [
    ...storeImports.allowedStoreOrdersFields,
    "store_credit_total",
  ];
}

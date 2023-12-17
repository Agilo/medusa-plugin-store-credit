export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/customers/index"
  )) as any;
  imports.allowedStoreOrdersFields = [
    ...imports.allowedStoreOrdersFields,
    "store_credit",
  ];
}

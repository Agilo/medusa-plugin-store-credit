export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/customers/index"
  )) as any;
  imports.allowedStoreCustomersFields = [
    ...imports.allowedStoreCustomersFields,
    "store_credits",
  ];
}

import path from "path";
import { execa } from "execa";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..");
const firstArg = process.argv[2]?.trim();
const type = (["store", "admin"].includes(firstArg) ? firstArg : "store") as
  | "store"
  | "admin";

const oasOperationIds = {
  store: [
    // "GetBundles",
    // "GetBundlesBundle",
    // "GetBundlesBundleProducts"
  ],
  admin: [
    "AdminDeleteStoreCreditsStoreCredit",
    "AdminGetStoreCredits",
    "AdminGetStoreCreditsCustomers",
    "AdminGetStoreCreditsCustomersCustomer",
    "AdminGetStoreCreditsCustomersCustomerStoreCredits",
    "AdminGetStoreCreditsStoreCredit",
    "AdminGetStoreCreditTransactions",
    "AdminPostStoreCredits",
    "AdminPostStoreCreditsStoreCredit",
  ],
};

(async () => {
  await execa(
    "npx",
    [
      "medusa-oas",
      "oas",
      "--out-dir",
      ".oas",
      "--type",
      type,
      ...(type === "admin"
        ? ["--paths", "./packages/medusa-plugin-store-credit/src/"]
        : ["--paths", "./packages/medusa-plugin-store-credit/src/"]),
    ],
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );

  await execa(
    "npx",
    [
      "openapi-filter",
      `./.oas/${type}.oas.json`,
      `./.oas/filtered-${type}.oas.json`,
      "--inverse",
      "--valid",
      "--flags",
      "operationId",
      ...oasOperationIds[type].map((id) => ["-v", id]).flat(),
    ],
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );

  await execa(
    "npx",
    [
      "medusa-oas",
      "client",
      "--type",
      type,
      "--component",
      "types",
      "--src-file",
      `./.oas/filtered-${type}.oas.json`,
      "--out-dir",
      type === "admin"
        ? "./packages/medusa-plugin-store-credit/src/admin/packages/admin-client/src-generated/generated"
        : `./packages/medusa-plugin-store-credit-client/src-generated/generated`,
      "--clean",
    ],
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );
})();

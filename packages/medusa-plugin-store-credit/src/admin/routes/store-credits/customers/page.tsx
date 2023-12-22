import { RouteConfig } from "@medusajs/admin";
import { CurrencyDollarSolid } from "@medusajs/icons";
import { CustomerIndex } from "../../../packages/admin-ui-custom/ui/src/domain/store-credits/customers";
// import StoreCreditIndex from "../../packages/admin-ui-custom/ui/src/domain/bundles/overview";
// import SquaresPlus from "../../packages/admin-ui/ui/src/components/fundamentals/icons/squares-plus";

const Page = () => {
  return <CustomerIndex />;
  // return <>Store Credit customers...</>;
  // return <StoreCreditIndex />;
};

export const config: RouteConfig = {
  link: {
    label: "Store Credit",
    icon: CurrencyDollarSolid,
  },
};

export default Page;

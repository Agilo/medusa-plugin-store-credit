import { OrderDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import StoreCreditsSection from "../packages/admin-ui-custom/ui/src/components/organisms/store-credits-section";

const StoreCreditWidget = ({ order }: OrderDetailsWidgetProps) => {
  return <StoreCreditsSection order={order} />;
};

export const config: WidgetConfig = {
  zone: "order.details.after",
};

export default StoreCreditWidget;

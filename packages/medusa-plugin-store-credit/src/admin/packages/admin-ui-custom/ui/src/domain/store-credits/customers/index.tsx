import BodyCard from "../../../../../../admin-ui/ui/src/components/organisms/body-card";
import Spacer from "../../../../../../admin-ui/ui/src/components/atoms/spacer";
import CustomerTable from "../../../components/templates/customer-table";
import CustomersPageTableHeader from "./header";

export const CustomerIndex = () => {
  return (
    <div className="gap-y-xsmall flex flex-col">
      <BodyCard
        customHeader={<CustomersPageTableHeader activeView="customers" />}
        className="h-fit"
      >
        <CustomerTable />
      </BodyCard>

      <Spacer />
    </div>
  );
};

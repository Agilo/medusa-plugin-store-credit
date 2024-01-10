import Spacer from "../../../../../../admin-ui/ui/src/components/atoms/spacer";
import PlusIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/plus-icon";
import { ActionType } from "../../../../../../admin-ui/ui/src/components/molecules/actionables";
import BodyCard from "../../../../../../admin-ui/ui/src/components/organisms/body-card";
import useToggleState from "../../../../../../admin-ui/ui/src/hooks/use-toggle-state";
import CustomerTable from "../../../components/templates/customer-table";
import NewStoreCredit from "../new";
import CustomersPageTableHeader from "./header";

export const CustomerIndex = () => {
  const {
    state: showCreateModal,
    open: openCreateModal,
    close: closeCreateModal,
  } = useToggleState();

  const actions: ActionType[] = [
    {
      label: "New Store Credit",
      onClick: openCreateModal,
      icon: <PlusIcon size={20} />,
    },
  ];

  return (
    <div className="gap-y-xsmall flex flex-col">
      <BodyCard
        customHeader={<CustomersPageTableHeader activeView="customers" />}
        className="h-fit"
        actionables={actions}
      >
        <CustomerTable />
      </BodyCard>

      <Spacer />

      {showCreateModal && <NewStoreCredit onClose={closeCreateModal} />}
    </div>
  );
};

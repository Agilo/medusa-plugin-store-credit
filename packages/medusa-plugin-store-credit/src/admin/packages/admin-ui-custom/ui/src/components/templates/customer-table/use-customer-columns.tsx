// import moment from "moment"
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getColor } from "../../../../../../admin-ui/ui/src/utils/color";
import CustomerAvatarItem from "../../../../../../admin-ui/ui/src/components/molecules/customer-avatar-item";

export const useCustomerColumns = () => {
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      // {
      //   Header: t("customer-table-date-added", "Date added"),
      //   accessor: "created_at", // accessor is the "key" in the data
      //   Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      // },
      {
        Header: t("customer-table-name", "Name"),
        accessor: "customer",
        Cell: ({ row }) => {
          console.log("row", row);
          return (
            <CustomerAvatarItem
              customer={row.original.customer}
              color={getColor(row.index)}
            />
          );
        },
      },
      {
        Header: t("customer-table-email", "Email"),
        accessor: "customer.email",
      },
      {
        Header: t("customer-table-region", "Region"),
        accessor: "region.name",
      },
      {
        Header: t("customer-table-original-amount", "Original Amount"),
        accessor: "amount",
      },
      {
        Header: t("customer-table-balance", "Balance"),
        accessor: "balance",
      },
      // {
      //   accessor: "customer.orders",
      //   Header: () => (
      //     <div className="text-right">
      //       {t("customer-table-orders", "Orders")}
      //     </div>
      //   ),
      //   Cell: ({ cell: { value } }) => (
      //     <div className="text-right">{value?.length || 0}</div>
      //   ),
      // },
      {
        Header: "",
        accessor: "col-2",
      },
    ],
    []
  );

  return [columns];
};

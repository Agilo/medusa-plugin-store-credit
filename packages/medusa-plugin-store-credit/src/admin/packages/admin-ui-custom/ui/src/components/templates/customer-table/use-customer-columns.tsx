import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CustomerAvatarItem from "../../../../../../admin-ui/ui/src/components/molecules/customer-avatar-item";
import { getColor } from "../../../../../../admin-ui/ui/src/utils/color";
import { formatAmountWithSymbol } from "../../../../../../admin-ui/ui/src/utils/prices";

export const useCustomerColumns = () => {
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      {
        Header: t("store-credits-customer-table-name", "Name"),
        accessor: "customer",
        Cell: ({ row }) => {
          return (
            <CustomerAvatarItem
              customer={row.original.customer}
              color={getColor(row.index)}
            />
          );
        },
      },
      {
        Header: t("store-credits-customer-table-email", "Email"),
        accessor: "customer.email",
      },
      {
        Header: t("store-credits-customer-table-region", "Region"),
        accessor: "region.name",
      },
      {
        Header: t(
          "store-credits-customer-table-original-amount",
          "Original Amount"
        ),
        accessor: "amount",
        Cell: ({ row, cell: { value } }) =>
          formatAmountWithSymbol({
            amount: value,
            currency: row.original.region.currency_code,
            digits: 2,
          }),
      },
      {
        Header: t("store-credits-customer-table-balance", "Balance"),
        accessor: "balance",
        Cell: ({ row, cell: { value } }) =>
          formatAmountWithSymbol({
            amount: value,
            currency: row.original.region.currency_code,
            digits: 2,
          }),
      },
      {
        Header: "",
        accessor: "col-2",
      },
    ],
    []
  );

  return [columns];
};

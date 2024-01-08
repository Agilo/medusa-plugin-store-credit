import { Order } from "@medusajs/medusa";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import { StoreCredit } from "../../../../../../../../models/store-credit";
import StatusIndicator from "../../../../../../admin-ui/ui/src/components/fundamentals/status-indicator";
import { formatAmountWithSymbol } from "../../../../../../admin-ui/ui/src/utils/prices";

export const useCustomerStoreCreditsColumns = (): Column<Order>[] => {
  const { t } = useTranslation();

  const getStoreCreditStatus = (is_disabled) => {
    if (is_disabled) {
      return <StatusIndicator title={"Disabled"} variant={"default"} />;
    } else {
      return <StatusIndicator title={"Active"} variant={"success"} />;
    }
  };

  const columns = useMemo(() => {
    return [
      {
        Header: t("customer-store-credits-table-order", "Original Amount"),
        accessor: "value",
        Cell: ({ row, cell: { value } }) => {
          return formatAmountWithSymbol({
            amount: value,
            currency: row.original.region.currency_code,
            digits: 2,
          });
        },
      },
      {
        Header: t("customer-store-credits-table-balance", "Balance"),
        accessor: "balance",
        Cell: ({ row, cell: { value } }) =>
          formatAmountWithSymbol({
            amount: value,
            currency: row.original.region.currency_code,
            digits: 2,
          }),
      },
      {
        Header: t("customer-store-credits-table-region", "Region"),
        accessor: "region.name",
      },
      {
        Header: t("customer-store-credits-table-expiry", "Expiry"),
        accessor: "ends_at",
        Cell: ({ value }) => {
          return value ? moment(value).format("DD MMM YYYY hh:mm") : "Never";
        },
      },
      {
        Header: t("customer-store-credits-table-status", "Status"),
        accessor: "is_disabled",
        Cell: ({ value }) => getStoreCreditStatus(value),
      },
      {
        Header: t("customer-store-credits-table-created", "Created"),
        accessor: "created_at",
        Cell: ({ value }) => {
          return moment(value).format("DD MMM YYYY hh:mm");
        },
      },
    ] as Column<StoreCredit>[];
  }, []);

  return columns;
};

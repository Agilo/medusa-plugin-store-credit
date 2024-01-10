import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useTable } from "react-table";
import { useAdminStoreCreditTransactions } from "../../../../../../admin-client";
import Table from "../../../../../../admin-ui/ui/src/components/molecules/table";
import TableContainer from "../../../../../../admin-ui/ui/src/components/organisms/table-container";
import { useCustomerStoreCreditsColumns } from "./use-customer-store-credits-columns";

const LIMIT = 15;

type Props = {
  id: string;
};

const StoreCreditTransactionsTable = ({ id }: Props) => {
  const { t } = useTranslation();
  // const [selectedOrderForTransfer, setSelectedOrderForTransfer] =
  //   useState<Order | null>(null)

  const [offset, setOffset] = useState(0);
  const { store_credit_transactions, isLoading, count } =
    useAdminStoreCreditTransactions({
      limit: LIMIT,
      offset: offset,
      store_credit_id: id!,
    });
  // const { orders, isLoading, count } = useAdminOrders(
  //   {
  //     customer_id: id!,
  //     offset: offset,
  //     limit: LIMIT,
  //     // TODO: expanding items is currently not supported by the API, re-enable when it is.
  //     // expand: "items",
  //   },
  //   {
  //     keepPreviousData: true,
  //   }
  // )

  const columns = useCustomerStoreCreditsColumns();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: store_credit_transactions || [],
      manualPagination: true,
      initialState: {
        pageSize: LIMIT,
        pageIndex: Math.floor(offset / LIMIT),
      },
      pageCount: Math.ceil((count || 0) / LIMIT),
      autoResetPage: false,
    },
    usePagination
  );

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + LIMIT);
      nextPage();
    }
  };

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - LIMIT);
      previousPage();
    }
  };

  return (
    <>
      <TableContainer
        hasPagination
        isLoading={isLoading}
        pagingState={{
          count: count!,
          offset,
          pageSize: offset + rows.length,
          title: t(
            "customer-store-credits-transactions-table-store-credit-transactions",
            "Store Credit Transactions"
          ),
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
      >
        <Table {...getTableProps()}>
          <Table.Head>
            {headerGroups.map((headerGroup) => {
              return (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <Table.HeadCell {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </Table.HeadCell>
                    );
                  })}
                </Table.HeadRow>
              );
            })}
          </Table.Head>
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Table.Row
                  forceDropdown
                  // actions={
                  //   [
                  //     {
                  //       label: t(
                  //         "customer-store-credits-transactions-table-transfer-order",
                  //         "Transfer order"
                  //       ),
                  //       icon: <RefreshIcon size={"20"} />,
                  //       onClick: () => {
                  //         setSelectedOrderForTransfer(row.original as Order)
                  //       },
                  //     },
                  //   ]
                  // }
                  {...row.getRowProps()}
                  linkTo={`/a/store-credits/${row.original.id}`}
                >
                  {row.cells.map((cell) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </TableContainer>
      {/* {selectedOrderForTransfer && (
        <TransferOrdersModal
          onDismiss={() => setSelectedOrderForTransfer(null)}
          order={selectedOrderForTransfer}
        />
      )} */}
    </>
  );
};

export default StoreCreditTransactionsTable;

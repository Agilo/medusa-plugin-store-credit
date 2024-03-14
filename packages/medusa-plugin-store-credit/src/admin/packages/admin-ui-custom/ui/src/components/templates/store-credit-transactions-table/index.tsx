import moment from "moment";
import { StoreCredit } from "../../../../../../admin-client";
import Table from "../../../../../../admin-ui/ui/src/components/molecules/table";
import TableContainer from "../../../../../../admin-ui/ui/src/components/organisms/table-container";
import { formatAmountWithSymbol } from "../../../../../../admin-ui/ui/src/utils/prices";

type Props = {
  storeCredit: StoreCredit;
};

const StoreCreditTransactionsTable = ({ storeCredit }: Props) => {
  const transactions = storeCredit.store_credit_transactions || [];

  return (
    <>
      <TableContainer hasPagination={false} pagingState={undefined}>
        <Table>
          <Table.Head>
            <Table.HeadRow>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Order</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
            </Table.HeadRow>
          </Table.Head>
          <Table.Body>
            {transactions.map((transaction) => {
              return (
                <Table.Row>
                  <Table.Cell>
                    {moment(transaction.created_at).format("DD MMM YYYY hh:mm")}
                  </Table.Cell>
                  <Table.Cell>{transaction.order_id}</Table.Cell>
                  <Table.Cell>
                    {formatAmountWithSymbol({
                      amount: transaction.amount,
                      currency: storeCredit.region.currency_code,
                      digits: 2,
                    })}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </>
  );
};

export default StoreCreditTransactionsTable;

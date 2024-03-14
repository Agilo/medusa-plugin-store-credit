import { Response } from "@medusajs/medusa-js";
import { useQuery } from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import qs from "qs";
import {
  AdminGetStoreCreditTransactionsParams,
  AdminStoreCreditTransactionsListRes,
} from "../../../generated/models";
import { UseQueryOptionsWrapper } from "../../types";
import { queryKeysFactory } from "../utils/queryKeysFactory";

const ADMIN_STORE_CREDIT_TRANSACTIONS_QUERY_KEY =
  `admin_store_credit_transactions` as const;

export const adminStoreCreditTransactionKeys = queryKeysFactory(
  ADMIN_STORE_CREDIT_TRANSACTIONS_QUERY_KEY,
);

type StoreCreditQueryKeys = typeof adminStoreCreditTransactionKeys;

export const useAdminStoreCreditTransactions = (
  query?: AdminGetStoreCreditTransactionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditTransactionsListRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["list"]>
  >,
) => {
  const { client } = useMedusa();

  let path = "/admin/store-credit-transactions";

  if (query) {
    const queryString = qs.stringify(query);
    path = `/admin/store-credit-transactions?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    adminStoreCreditTransactionKeys.list(query),
    () => client.client.request("GET", path),
    options,
  );
  return { ...data, ...rest } as const;
};

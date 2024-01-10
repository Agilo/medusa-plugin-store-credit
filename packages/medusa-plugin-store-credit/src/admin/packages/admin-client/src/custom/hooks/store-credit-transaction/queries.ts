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
  ADMIN_STORE_CREDIT_TRANSACTIONS_QUERY_KEY
);

type StoreCreditQueryKeys = typeof adminStoreCreditTransactionKeys;

export const useAdminStoreCreditTransactions = (
  query?: AdminGetStoreCreditTransactionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditTransactionsListRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["list"]>
  >
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
    options
  );
  return { ...data, ...rest } as const;
};

// export const useAdminStoreCredit = (
//   id: string,
//   options?: UseQueryOptionsWrapper<
//     Response<AdminStoreCreditsRes>,
//     Error,
//     ReturnType<StoreCreditQueryKeys["detail"]>
//   >
// ) => {
//   const { client } = useMedusa();
//   const { data, ...rest } = useQuery(
//     adminStoreCreditTransactionKeys.detail(id),
//     () => client.client.request("GET", `/admin/store-credits/${id}`),
//     options
//   );
//   return { ...data, ...rest } as const;
// };

// export const useAdminCustomers = (
//   query?: AdminGetStoreCreditsCustomersParams,
//   options?: UseQueryOptionsWrapper<
//     Response<AdminStoreCreditsCustomersListRes>,
//     Error,
//     ReturnType<StoreCreditQueryKeys["listCustomers"]>
//   >
// ) => {
//   const { client } = useMedusa();

//   let path = "/admin/store-credits/customers";

//   if (query) {
//     const queryString = qs.stringify(query);
//     path = `/admin/store-credits/customers?${queryString}`;
//   }

//   const { data, ...rest } = useQuery(
//     adminStoreCreditTransactionKeys.listCustomers(query),
//     () => client.client.request("GET", path),
//     options
//   );
//   return { ...data, ...rest } as const;
// };

// export const useAdminCustomerStoreCredits = (
//   id: string,
//   query?: AdminGetStoreCreditsCustomersCustomerStoreCreditsParams,
//   options?: UseQueryOptionsWrapper<
//     Response<AdminStoreCreditsCustomersCustomerStoreCreditsListRes>,
//     Error,
//     ReturnType<StoreCreditQueryKeys["listCustomerStoreCredits"]>
//   >
// ) => {
//   const { client } = useMedusa();

//   let path = `/admin/store-credits/customers/${id}/store-credits`;

//   if (query) {
//     const queryString = qs.stringify(query);
//     path = `/admin/store-credits/customers/${id}/store-credits?${queryString}`;
//   }

//   const { data, ...rest } = useQuery(
//     adminStoreCreditTransactionKeys.listCustomerStoreCredits(id, query),
//     () => client.client.request("GET", path),
//     options
//   );

//   return { ...data, ...rest } as const;
// };

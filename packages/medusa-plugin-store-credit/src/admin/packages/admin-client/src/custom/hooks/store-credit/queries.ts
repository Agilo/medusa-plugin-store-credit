import { Response } from "@medusajs/medusa-js";
import { useQuery } from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import qs from "qs";
import {
  AdminGetStoreCreditParams,
  AdminGetStoreCreditsCustomersCustomerParams,
  AdminGetStoreCreditsCustomersCustomerStoreCreditsParams,
  AdminGetStoreCreditsCustomersParams,
  AdminGetStoreCreditsParams,
  AdminStoreCreditsCustomersCustomerRes,
  AdminStoreCreditsCustomersCustomerStoreCreditsListRes,
  AdminStoreCreditsCustomersListRes,
  AdminStoreCreditsListRes,
  AdminStoreCreditsRes,
} from "../../../generated/models";
import { UseQueryOptionsWrapper } from "../../types";
import { queryKeysFactory } from "../utils/queryKeysFactory";

const ADMIN_STORE_CREDITS_QUERY_KEY = `admin_store_credits` as const;

export const adminStoreCreditKeys = {
  ...queryKeysFactory(ADMIN_STORE_CREDITS_QUERY_KEY),
  listCustomers(query?: any) {
    return [...this.all, "list", "customers", { ...(query || {}) }] as const;
  },
  detailCustomer(customerId: string, regionId: string) {
    return [...this.all, "customers", "detail", customerId, regionId];
  },
  listCustomerStoreCredits(id: string, query?: any) {
    return [
      ...this.all,
      "list",
      "customer",
      id,
      "store-credits",
      { ...(query || {}) },
    ] as const;
  },
};

type StoreCreditQueryKeys = typeof adminStoreCreditKeys;

export const useAdminStoreCredits = (
  query?: AdminGetStoreCreditsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditsListRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa();

  let path = "/admin/store-credits";

  if (query) {
    const queryString = qs.stringify(query);
    path = `/admin/store-credits?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    adminStoreCreditKeys.list(query),
    () => client.client.request("GET", path),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminStoreCredit = (
  id: string,
  query?: AdminGetStoreCreditParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditsRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();

  let path = `/admin/store-credits/${id}`;

  if (query) {
    const queryString = qs.stringify(query);
    path = `/admin/store-credits/${id}?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    adminStoreCreditKeys.detail(id),
    () => client.client.request("GET", path),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminCustomers = (
  query?: AdminGetStoreCreditsCustomersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditsCustomersListRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["listCustomers"]>
  >
) => {
  const { client } = useMedusa();

  let path = "/admin/store-credits/customers";

  if (query) {
    const queryString = qs.stringify(query);
    path = `/admin/store-credits/customers?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    adminStoreCreditKeys.listCustomers(query),
    () => client.client.request("GET", path),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminCustomer = (
  customerId: string,
  regionId: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditsCustomersCustomerRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["detailCustomer"]>
  >
) => {
  const { client } = useMedusa();

  const { data, ...rest } = useQuery(
    adminStoreCreditKeys.detailCustomer(customerId, regionId),
    () =>
      client.client.request(
        "GET",
        `/admin/store-credits/customers/${customerId}?region_id=${regionId}`
      ),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminCustomerStoreCredits = (
  id: string,
  query?: AdminGetStoreCreditsCustomersCustomerStoreCreditsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditsCustomersCustomerStoreCreditsListRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["listCustomerStoreCredits"]>
  >
) => {
  const { client } = useMedusa();

  let path = `/admin/store-credits/customers/${id}/store-credits`;

  if (query) {
    const queryString = qs.stringify(query);
    path = `/admin/store-credits/customers/${id}/store-credits?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    adminStoreCreditKeys.listCustomerStoreCredits(id, query),
    () => client.client.request("GET", path),
    options
  );

  return { ...data, ...rest } as const;
};

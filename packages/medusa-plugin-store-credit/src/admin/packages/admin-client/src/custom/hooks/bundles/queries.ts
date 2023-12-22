import { Response } from "@medusajs/medusa-js";
import { useQuery } from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import qs from "qs";
import {
  AdminStoreCreditsListRes,
  // AdminStoreCreditsRes,
  AdminGetStoreCreditsParams,
} from "../../../generated/models";
import { UseQueryOptionsWrapper } from "../../types";
import { queryKeysFactory } from "../utils/queryKeysFactory";

const ADMIN_STORE_CREDITS_QUERY_KEY = `admin_store_credits` as const;

export const adminStoreCreditKeys = {
  ...queryKeysFactory(ADMIN_STORE_CREDITS_QUERY_KEY),
  detailProducts(id: string, query?: any) {
    return [
      ...this.detail(id),
      "products" as const,
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
  options?: UseQueryOptionsWrapper<
    Response<AdminStoreCreditsRes>,
    Error,
    ReturnType<StoreCreditQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminStoreCreditKeys.detail(id),
    () => client.client.request("GET", `/admin/store-credits/${id}`),
    options
  );
  return { ...data, ...rest } as const;
};

// export const useAdminBundleProducts = (
//   id: string,
//   query?: AdminGetBundlesBundleProductsParams,
//   options?: UseQueryOptionsWrapper<
//     Response<AdminBundlesBundleProductsListRes>,
//     Error,
//     ReturnType<StoreCreditQueryKeys["detailProducts"]>
//   >
// ) => {
//   const { client } = useMedusa();

//   let path = `/store/bundles/${id}/products`;

//   if (query) {
//     const queryString = qs.stringify(query);
//     path = `/admin/bundles/${id}/products?${queryString}`;
//   }

//   const { data, ...rest } = useQuery(
//     adminStoreCreditKeys.detailProducts(id, query),
//     () => client.client.request("GET", path),
//     options
//   );

//   return { ...data, ...rest } as const;
// };

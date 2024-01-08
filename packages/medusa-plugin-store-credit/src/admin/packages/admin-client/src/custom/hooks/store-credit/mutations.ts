import { Response } from "@medusajs/medusa-js";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import {
  AdminPostStoreCreditsStoreCreditReq,
  AdminStoreCreditsRes,
} from "../../../generated/models";
import { buildOptions } from "../utils/buildOptions";
import { adminStoreCreditKeys } from "./queries";

// export const useAdminCreateBundle = (
//   options?: UseMutationOptions<
//     Response<AdminBundlesRes>,
//     Error,
//     AdminPostBundlesReq
//   >
// ) => {
//   const { client } = useMedusa();
//   const queryClient = useQueryClient();
//   return useMutation(
//     (payload: AdminPostBundlesReq) =>
//       client.client.request("POST", "/admin/bundles", payload),
//     buildOptions(queryClient, adminBundleKeys.lists(), options)
//   );
// };

export const useAdminUpdateStoreCredit = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminStoreCreditsRes>,
    Error,
    AdminPostStoreCreditsStoreCreditReq
  >
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AdminPostStoreCreditsStoreCreditReq) =>
      client.client.request("POST", `/admin/store-credits/${id}`, payload),
    buildOptions(
      queryClient,
      [adminStoreCreditKeys.lists(), adminStoreCreditKeys.detail(id)],
      options
    )
  );
};

// export const useAdminDeleteBundle = (
//   id: string,
//   options?: UseMutationOptions<Response<AdminBundlesDeleteRes>, Error, void>
// ) => {
//   const { client } = useMedusa();
//   const queryClient = useQueryClient();

//   return useMutation(
//     () => client.client.request("DELETE", `/admin/bundles/${id}`),
//     buildOptions(
//       queryClient,
//       [adminBundleKeys.lists(), adminBundleKeys.detail(id)],
//       options
//     )
//   );
// };

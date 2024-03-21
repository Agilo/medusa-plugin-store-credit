import { Response } from "@medusajs/medusa-js";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import {
  AdminPostStoreCreditsReq,
  AdminPostStoreCreditsStoreCreditReq,
  AdminStoreCreditsRes,
} from "../../../generated/models";
import { buildOptions } from "../utils/buildOptions";
import { adminStoreCreditKeys } from "./queries";

export const useAdminCreateStoreCredit = (
  options?: UseMutationOptions<
    Response<AdminStoreCreditsRes>,
    Error,
    AdminPostStoreCreditsReq
  >,
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AdminPostStoreCreditsReq) =>
      client.client.request("POST", "/admin/store-credits", payload),
    buildOptions(queryClient, adminStoreCreditKeys.all, options),
  );
};

export const useAdminUpdateStoreCredit = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminStoreCreditsRes>,
    Error,
    AdminPostStoreCreditsStoreCreditReq
  >,
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AdminPostStoreCreditsStoreCreditReq) =>
      client.client.request("POST", `/admin/store-credits/${id}`, payload),
    buildOptions(queryClient, [adminStoreCreditKeys.all], options),
  );
};

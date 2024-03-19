import { useAdminStore } from "medusa-react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminCreateStoreCredit } from "../../../../../admin-client";
import MetadataForm from "../../../../../admin-ui/ui/src/components/forms/general/metadata-form";
import Button from "../../../../../admin-ui/ui/src/components/fundamentals/button";
import Modal from "../../../../../admin-ui/ui/src/components/molecules/modal";
import TextArea from "../../../../../admin-ui/ui/src/components/molecules/textarea";
import useNotification from "../../../../../admin-ui/ui/src/hooks/use-notification";
import { getErrorMessage } from "../../../../../admin-ui/ui/src/utils/error-messages";
import { nestedForm } from "../../../../../admin-ui/ui/src/utils/nested-form";
import StoreCreditBalanceForm, {
  StoreCreditBalanceFormType,
} from "../../components/forms/store-credit/store-credit-balance-form";
import StoreCreditCustomerForm, {
  StoreCreditCustomerFormType,
} from "../../components/forms/store-credit/store-credit-customer-form";
import StoreCreditEndsAtForm, {
  StoreCreditEndsAtFormType,
} from "../../components/forms/store-credit/store-credit-ends-at-form";
import StoreCreditRegionForm, {
  StoreCreditRegionFormType,
} from "../../components/forms/store-credit/store-credit-region-form";

type NewStoreCreditProps = {
  onClose: () => void;
};

type StoreCreditFormType = {
  balance: StoreCreditBalanceFormType;
  customer: StoreCreditCustomerFormType;
  description: string;
  ends_at: StoreCreditEndsAtFormType;
  metadata: any;
  region: StoreCreditRegionFormType;
};

const NewStoreCredit = ({ onClose }: NewStoreCreditProps) => {
  const { mutate, isLoading: isSubmitting } = useAdminCreateStoreCredit();
  const { store } = useAdminStore();
  // const navigate = useNavigate();
  const notification = useNotification();
  const { t } = useTranslation();
  const form = useForm<StoreCreditFormType>();
  const { reset, register, watch, handleSubmit } = form;
  const regionWatcher = watch("region");
  const currencyCode =
    regionWatcher?.region_id?.currency_code ||
    store?.default_currency_code ||
    "";

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const customerWatcher = watch("customer");

  const onSubmit: SubmitHandler<StoreCreditFormType> = (data) => {
    mutate(
      {
        value: data.balance.amount,
        ends_at: data.ends_at?.ends_at?.toJSON(),
        region_id: data.region.region_id.value,
        customer_id: data.customer.customer.id,
        description: data.description,
        metadata: data.metadata.entries,
      },
      {
        onSuccess: () => {
          notification(
            t("store-credits-created-store-credit", "Created store credit"),
            t(
              "store-credits-store-credit-was-created-successfully",
              "Store credit was created successfully"
            ),
            "success"
          );
          onClose();
        },
        onError: (error) => {
          notification(
            t("store-credits-error", "Error"),
            getErrorMessage(error),
            "error"
          );
        },
      }
    );
  };

  return (
    <Modal handleClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <div>
              <h1 className="inter-xlarge-semibold">
                {t("store-credits-new-store-credit", "New Store Credit")}
              </h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("store-credits-details", "Details")}
                </h2>
                <div className="gap-x-xsmall grid grid-cols-2">
                  <StoreCreditRegionForm form={nestedForm(form, "region")} />
                  <StoreCreditBalanceForm
                    form={nestedForm(form, "balance")}
                    currencyCode={currencyCode}
                  />
                </div>
              </div>
              <StoreCreditEndsAtForm form={nestedForm(form, "ends_at")} />
              <StoreCreditCustomerForm form={nestedForm(form, "customer")} />
              <TextArea
                label="Description"
                placeholder={""}
                rows={3}
                className="mb-small"
                {...register("description")}
              />
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("details-metadata", "Metadata")}
                </h2>
                <MetadataForm form={nestedForm(form, "metadata")} />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end">
              <Button
                type="submit"
                variant="ghost"
                size="small"
                className="w-eventButton"
                onClick={onClose}
              >
                {t("store-credits-cancel", "Cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t("store-credits-create", "Create")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default NewStoreCredit;

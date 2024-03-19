import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  StoreCredit,
  useAdminUpdateStoreCredit,
} from "../../../../../../admin-client";
import MetadataForm, {
  MetadataFormType,
  getMetadataFormValues,
  getSubmittableMetadata,
} from "../../../../../../admin-ui/ui/src/components/forms/general/metadata-form";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
import Modal from "../../../../../../admin-ui/ui/src/components/molecules/modal";
import TextArea from "../../../../../../admin-ui/ui/src/components/molecules/textarea";
import useNotification from "../../../../../../admin-ui/ui/src/hooks/use-notification";
import { getErrorMessage } from "../../../../../../admin-ui/ui/src/utils/error-messages";
import { nestedForm } from "../../../../../../admin-ui/ui/src/utils/nested-form";
import StoreCreditEndsAtForm, {
  StoreCreditEndsAtFormType,
} from "../../../components/forms/store-credit/store-credit-ends-at-form";

type EditStoreCreditModalProps = {
  onClose: () => void;
  open: boolean;
  storeCredit: StoreCredit;
};

type EditStoreCreditFormType = {
  // region: GiftCardRegionFormType;
  ends_at: StoreCreditEndsAtFormType;
  description: string;
  metadata: MetadataFormType;
};

const EditStoreCreditModal = ({
  open,
  onClose,
  storeCredit,
}: EditStoreCreditModalProps) => {
  const { t } = useTranslation();
  const form = useForm<EditStoreCreditFormType>({
    defaultValues: getDefaultValues(storeCredit),
  });
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    register,
  } = form;

  const { mutate, isLoading } = useAdminUpdateStoreCredit(storeCredit.id);

  const notification = useNotification();

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        // region_id: data.region.region_id.value,
        ends_at: data.ends_at.ends_at ? data.ends_at.ends_at.toJSON() : null,
        description: data.description,
        metadata: getSubmittableMetadata(data.metadata),
      },
      {
        onSuccess: () => {
          notification(
            t("details-updated-store-credit", "Updated Store Credit"),
            t(
              "details-store-credit-was-successfully-updated",
              "Store Credit was successfully updated"
            ),
            "success"
          );

          onClose();
        },
        onError: (err) => {
          notification(
            t(
              "details-failed-to-update-store-credit",
              "Failed to update Store Credit"
            ),
            getErrorMessage(err),
            "error"
          );
        },
      }
    );
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(storeCredit));
    }
  }, [open, reset, storeCredit]);

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">
            {t("details-edit-store-credit", "Edit Store Credit")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("details-details", "Details")}
                </h2>
              </div>
              <StoreCreditEndsAtForm form={nestedForm(form, "ends_at")} />
              <TextArea
                label="Description"
                placeholder={""}
                rows={3}
                className="mb-small"
                {...register("description")}
                // errors={errors}
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
            <div className="gap-x-xsmall flex w-full justify-end">
              <Button
                variant="secondary"
                size="small"
                onClick={onClose}
                type="button"
              >
                {t("details-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={isLoading || !isDirty}
                loading={isLoading}
              >
                {t("details-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const getDefaultValues = (
  storeCredit: StoreCredit
): EditStoreCreditFormType => {
  return {
    // region: {
    //   region_id: {
    //     label: storeCredit.region.name,
    //     value: storeCredit.region.id,
    //     currency_code: storeCredit.region.currency_code,
    //   },
    // },
    ends_at: {
      ends_at: storeCredit.ends_at ? new Date(storeCredit.ends_at) : null,
    },
    description: storeCredit.description || null,
    metadata: getMetadataFormValues(storeCredit.metadata),
  };
};

export default EditStoreCreditModal;

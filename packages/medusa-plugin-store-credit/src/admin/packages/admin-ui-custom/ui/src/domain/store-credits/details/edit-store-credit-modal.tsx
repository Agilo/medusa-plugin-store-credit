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
  } = form;

  const { mutate, isLoading } = useAdminUpdateStoreCredit(storeCredit.id);

  const notification = useNotification();

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        // region_id: data.region.region_id.value,
        ends_at: data.ends_at.ends_at ? data.ends_at.ends_at.toJSON() : null,
        metadata: getSubmittableMetadata(data.metadata),
      },
      {
        onSuccess: () => {
          notification(
            t("details-updated-gift-card", "Updated Gift card"),
            t(
              "details-gift-card-was-successfully-updated",
              "Gift card was successfully updated"
            ),
            "success"
          );

          onClose();
        },
        onError: (err) => {
          notification(
            t(
              "details-failed-to-update-gift-card",
              "Failed to update Gift card"
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
            {t("details-edit-gift-card", "Edit Gift Card")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("details-details", "Details")}
                </h2>
                {/* <GiftCardRegionForm form={nestedForm(form, "region")} /> */}
              </div>
              <StoreCreditEndsAtForm form={nestedForm(form, "ends_at")} />
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
    metadata: getMetadataFormValues(storeCredit.metadata),
  };
};

export default EditStoreCreditModal;

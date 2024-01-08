import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  StoreCredit,
  useAdminUpdateStoreCredit,
} from "../../../../../../admin-client";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
import Modal from "../../../../../../admin-ui/ui/src/components/molecules/modal";
import useNotification from "../../../../../../admin-ui/ui/src/hooks/use-notification";
import { getErrorMessage } from "../../../../../../admin-ui/ui/src/utils/error-messages";
import { nestedForm } from "../../../../../../admin-ui/ui/src/utils/nested-form";
import StoreCreditBalanceForm, {
  StoreCreditBalanceFormType,
} from "../../../components/forms/store-credit/store-credit-balance-form";

type UpdateBalanceModalProps = {
  open: boolean;
  onClose: () => void;
  storeCredit: StoreCredit;
};

type UpdateBalanceModalFormData = {
  balance: StoreCreditBalanceFormType;
};

const UpdateBalanceModal = ({
  open,
  onClose,
  storeCredit,
}: UpdateBalanceModalProps) => {
  const { t } = useTranslation();
  const form = useForm<UpdateBalanceModalFormData>({
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
        balance: data.balance.amount,
      },
      {
        onSuccess: () => {
          notification(
            t("details-balance-updated", "Balance updated"),
            t(
              "details-gift-card-balance-was-updated",
              "Gift card balance was updated"
            ),
            "success"
          );

          onClose();
        },
        onError: (err) => {
          notification(
            t("details-failed-to-update-balance", "Failed to update balance"),
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
            {t("details-update-balance", "Update Balance")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <StoreCreditBalanceForm
              form={nestedForm(form, "balance")}
              currencyCode={storeCredit.region.currency_code}
              originalAmount={storeCredit.value}
            />
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
                loading={isLoading}
                disabled={isLoading || !isDirty}
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
): UpdateBalanceModalFormData => {
  return {
    balance: {
      amount: storeCredit.balance,
    },
  };
};

export default UpdateBalanceModal;

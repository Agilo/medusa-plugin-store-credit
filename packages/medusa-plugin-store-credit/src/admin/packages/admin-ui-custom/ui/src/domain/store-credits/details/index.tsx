import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminStoreCredit,
  useAdminUpdateStoreCredit,
} from "../../../../../../../packages/admin-client";
import { formatAmountWithSymbol } from "../../../../../../../packages/admin-ui/ui/src/utils/prices";
import BackButton from "../../../../../../admin-ui/ui/src/components/atoms/back-button";
import Spinner from "../../../../../../admin-ui/ui/src/components/atoms/spinner";
import DollarSignIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/dollar-sign-icon";
import EditIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/edit-icon";
import { ActionType } from "../../../../../../admin-ui/ui/src/components/molecules/actionables";
import StatusSelector from "../../../../../../admin-ui/ui/src/components/molecules/status-selector";
import BodyCard from "../../../../../../admin-ui/ui/src/components/organisms/body-card";
import RawJSON from "../../../../../../admin-ui/ui/src/components/organisms/raw-json";
import useNotification from "../../../../../../admin-ui/ui/src/hooks/use-notification";
import useToggleState from "../../../../../../admin-ui/ui/src/hooks/use-toggle-state";
import { getErrorMessage } from "../../../../../../admin-ui/ui/src/utils/error-messages";
import { getErrorStatus } from "../../../../../../admin-ui/ui/src/utils/get-error-status";
import StoreCreditTransactionsTable from "../../../components/templates/store-credit-transactions-table";
import EditStoreCreditModal from "./edit-store-credit-modal";
import UpdateBalanceModal from "./update-balance-modal";

const StoreCreditDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { store_credit, isLoading, error } = useAdminStoreCredit(id!, {
    expand: "customer,region,store_credit_transactions",
  });
  const updateStoreCredit = useAdminUpdateStoreCredit(store_credit?.id);
  const { t } = useTranslation();

  const storeCreditName = `Store Credit: ${
    store_credit
      ? formatAmountWithSymbol({
          amount: store_credit.value,
          currency: store_credit.region.currency_code,
          digits: 2,
        })
      : ""
  }`;

  const {
    state: editState,
    open: openEdit,
    close: closeEdit,
  } = useToggleState();

  const {
    state: balanceState,
    open: openBalance,
    close: closeBalance,
  } = useToggleState();

  const actions: ActionType[] = [
    {
      label: t("store-credit-detail-edit-details", "Edit details"),
      onClick: openEdit,
      icon: <EditIcon size={20} />,
    },
    {
      label: t("store-credit-detail-update-balance-label", "Update balance"),
      onClick: openBalance,
      icon: <DollarSignIcon size={20} />,
    },
  ];

  const notification = useNotification();

  const updateStatus = (data: { is_disabled?: boolean }) => {
    console.log("updateStoreCredit.mutate todo...");
    updateStoreCredit.mutate(
      { is_disabled: data.is_disabled },
      {
        onSuccess: () => {
          notification(
            t("details-updated-status", "Updated status"),
            t(
              "details-successfully-updated-the-status-of-the-gift-card",
              "Successfully updated the status of the Gift Card",
            ),
            "success",
          );
        },
        onError: (err) =>
          notification(
            t("details-error", "Error"),
            getErrorMessage(err),
            "error",
          ),
      },
    );
  };

  if (error) {
    const errorStatus = getErrorStatus(error);

    if (errorStatus) {
      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404");
        return null;
      }
    }

    // Let the error boundary handle the error
    throw error;
  }

  if (isLoading || !store_credit) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    );
  }

  return (
    <div>
      <BackButton
        label={t("store-credit-detail-back-to-customers", "Back to Customers")}
        path="/a/store-credits/customers"
        className="mb-xsmall"
      />
      <div className="gap-y-xsmall flex flex-col">
        <BodyCard
          compact={true}
          title={storeCreditName}
          status={
            <StatusSelector
              isDraft={!!store_credit.is_disabled}
              activeState={"Active"}
              draftState={"Disable"}
              onChange={() =>
                updateStatus({ is_disabled: !store_credit.is_disabled })
              }
            />
          }
          actionables={actions}
          forceDropdown={true}
        >
          <div className="flex justify-between">
            <div className="flex space-x-6 divide-x">
              <div className="flex flex-col">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {t("store-credit-detail-user", "User")}
                </div>
                <div>{store_credit.customer.email}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {t("store-credit-detail-original-amount", "Original amount")}
                </div>
                <div>
                  {formatAmountWithSymbol({
                    amount: store_credit.value,
                    currency: store_credit.region.currency_code,
                    digits: 2,
                  })}
                </div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {t("store-credit-detail-balance", "Balance")}
                </div>
                <div>
                  {formatAmountWithSymbol({
                    amount: store_credit.balance,
                    currency: store_credit.region.currency_code,
                    digits: 2,
                  })}
                </div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {t("store-credit-detail-region", "Region")}
                </div>
                <div>{store_credit.region.name}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {t("store-credit-detail-expiry", "Expiry")}
                </div>
                <div>
                  {store_credit.ends_at
                    ? moment(store_credit.ends_at).format("DD MMM YYYY hh:mm")
                    : "Never"}
                </div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {t("store-credit-detail-created", "Created")}
                </div>
                <div>
                  {moment(store_credit.created_at).format("DD MMM YYYY hh:mm")}
                </div>
              </div>
            </div>
          </div>
          {store_credit.description && (
            <div className="mt-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("store-credit-detail-description", "Description")}
              </div>
              <div>{store_credit.description}</div>
            </div>
          )}
        </BodyCard>
        <BodyCard
          title={t(
            "store-credit-detail-transactions",
            "Store Credit Transactions",
          )}
          subtitle={t(
            "store-credit-detail-an-overview-of-transactions",
            "List of store credit transactions",
          )}
        >
          <div className="flex  grow flex-col">
            <StoreCreditTransactionsTable storeCredit={store_credit} />
          </div>
        </BodyCard>

        <RawJSON
          data={store_credit}
          title={t("store-credit-detail-raw-store-credit", "Raw store credit")}
        />
      </div>

      <UpdateBalanceModal
        storeCredit={store_credit}
        onClose={closeBalance}
        open={balanceState}
      />

      <EditStoreCreditModal
        onClose={closeEdit}
        open={editState}
        storeCredit={store_credit}
      />
    </div>
  );
};

export default StoreCreditDetail;

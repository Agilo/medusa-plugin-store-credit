import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminStoreCredit } from "../../../../../../../packages/admin-client";
import { formatAmountWithSymbol } from "../../../../../../../packages/admin-ui/ui/src/utils/prices";
import BackButton from "../../../../../../admin-ui/ui/src/components/atoms/back-button";
import Spinner from "../../../../../../admin-ui/ui/src/components/atoms/spinner";
import EditIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/edit-icon";
import Actionables, {
  ActionType,
} from "../../../../../../admin-ui/ui/src/components/molecules/actionables";
import BodyCard from "../../../../../../admin-ui/ui/src/components/organisms/body-card";
import RawJSON from "../../../../../../admin-ui/ui/src/components/organisms/raw-json";
import Section from "../../../../../../admin-ui/ui/src/components/organisms/section";
import { getErrorStatus } from "../../../../../../admin-ui/ui/src/utils/get-error-status";

const StoreCreditDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { store_credit, isLoading, error } = useAdminStoreCredit(id!, {
    expand: "customer,region,store_credit_transactions",
  });
  const { t } = useTranslation();
  const [showEdit, setShowEdit] = useState(false);

  console.log("store_credit", store_credit);

  const storeCreditName = `Store Credit: ${
    store_credit
      ? formatAmountWithSymbol({
          amount: store_credit.value,
          currency: store_credit.region.currency_code,
          digits: 2,
        })
      : ""
  }`;

  const actions: ActionType[] = [
    {
      label: t("store-credit-detail-edit", "Edit"),
      onClick: () => setShowEdit(true),
      icon: <EditIcon size={20} />,
    },
  ];

  // const { getWidgets } = useWidgets()

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
        {/* {getWidgets("customer.details.before").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              entity={customer}
              injectionZone="customer.details.before"
              widget={w}
            />
          )
        })} */}

        <Section>
          <div className="flex w-full items-start justify-between">
            <div className="gap-x-base flex w-full items-center">
              {/* <div className="h-[64px] w-[64px]">
                <Avatar
                  user={customer}
                  font="inter-2xlarge-semibold w-full h-full"
                  color="bg-fuschia-40"
                />
              </div> */}
              <div className="flex grow flex-col">
                <h1 className="inter-xlarge-semibold text-grey-90 max-w-[50%] truncate">
                  {storeCreditName}
                </h1>
                <h3 className="inter-small-regular text-grey-50">
                  {store_credit.customer.email}
                </h3>
              </div>
            </div>
            <Actionables actions={actions} forceDropdown />
          </div>
          <div className="mt-6 flex space-x-6 divide-x">
            {/* <div className="flex flex-col">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("details-first-seen", "First seen")}
              </div>
              <div>{moment(customer.created_at).format("DD MMM YYYY")}</div>
            </div> */}
            {/* <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("details-phone", "Phone")}
              </div>
              <div className="max-w-[200px] truncate">
                {customer.phone || "N/A"}
              </div>
            </div> */}
            {/* <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("details-orders", "Orders")}
              </div>
              <div>{customer.orders.length}</div>
            </div> */}
            {/* <div className="h-100 flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("details-user", "User")}
              </div>
              <div className="h-50 flex items-center justify-center">
                <StatusDot
                  variant={customer.has_account ? "success" : "danger"}
                  title={customer.has_account ? "Registered" : "Guest"}
                />
              </div>
            </div> */}
            <div className="flex flex-col">
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
          <div className="mt-6">
            <div className="inter-smaller-regular text-grey-50 mb-1">
              {t("store-credit-detail-description", "Description")}
            </div>
            <div>{store_credit.description}</div>
          </div>
        </Section>
        <BodyCard
          title={t(
            "store-credit-detail-transactions",
            "Store Credit Transactions"
          )}
          subtitle={t(
            "store-credit-detail-an-overview-of-transactions",
            "List of store credit transactions"
          )}
        >
          <div className="flex  grow flex-col">
            {/* <StoreCreditTransactionsTable id={id} /> */}
          </div>
        </BodyCard>

        {/* {getWidgets("customer.details.after").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              entity={customer}
              injectionZone="customer.details.after"
              widget={w}
            />
          )
        })} */}

        <RawJSON
          data={store_credit}
          title={t("store-credit-detail-raw-store-credit", "Raw store credit")}
        />
      </div>

      {/* {showEdit && customer && (
        <EditCustomerModal
          customer={customer}
          handleClose={() => setShowEdit(false)}
        />
      )} */}
    </div>
  );
};

export default StoreCreditDetail;

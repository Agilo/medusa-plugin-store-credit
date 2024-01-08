// import { useAdminCustomer } from "medusa-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Avatar from "../../../../../../../admin-ui/ui/src/components/atoms/avatar";
import BackButton from "../../../../../../../admin-ui/ui/src/components/atoms/back-button";
import Spinner from "../../../../../../../admin-ui/ui/src/components/atoms/spinner";
// import WidgetContainer from "../../../components/extensions/widget-container"
import EditIcon from "../../../../../../../admin-ui/ui/src/components/fundamentals/icons/edit-icon";
// import StatusDot from "../../../components/fundamentals/status-indicator"
import Actionables, {
  ActionType,
} from "../../../../../../../admin-ui/ui/src/components/molecules/actionables";
import BodyCard from "../../../../../../../admin-ui/ui/src/components/organisms/body-card";
import RawJSON from "../../../../../../../admin-ui/ui/src/components/organisms/raw-json";
import Section from "../../../../../../../admin-ui/ui/src/components/organisms/section";
// import CustomerOrdersTable from "../../../components/templates/customer-orders-table"
// import { useWidgets } from "../../../providers/widget-provider"
import CustomerStoreCreditsTable from "../../../../components/templates/customer-store-credits-table";
import { useAdminCustomer } from "../../../../../../../admin-client";
import { getErrorStatus } from "../../../../../../../admin-ui/ui/src/utils/get-error-status";
import { formatAmountWithSymbol } from "../../../../../../../admin-ui/ui/src/utils/prices";
// import EditCustomerModal from "./edit"

const CustomerDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  console.log("searchParams.get(region_id)", searchParams.get("region_id"));
  const region_id = searchParams.get("region_id");
  const navigate = useNavigate();

  // const { customer, isLoading, error } = useAdminCustomer(id!)
  const { customer, isLoading, error } = useAdminCustomer(id, region_id);
  // const { customer, isLoading, error } = useAdminStoreCreditCustomer(id!);
  const { t } = useTranslation();
  const [showEdit, setShowEdit] = useState(false);

  const customerName = () => {
    if (customer?.customer.first_name && customer?.customer.last_name) {
      return `${customer?.customer.first_name} ${customer?.customer.last_name}`;
    } else {
      return customer?.customer.email;
    }
  };

  const actions: ActionType[] = [
    {
      label: t("store-credit-customer-details-edit", "Edit"),
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

  if (isLoading || !customer) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    );
  }

  return (
    <div>
      <BackButton
        label={t(
          "store-credit-customer-details-back-to-customers",
          "Back to Customers"
        )}
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
              <div className="h-[64px] w-[64px]">
                <Avatar
                  user={customer.customer}
                  font="inter-2xlarge-semibold w-full h-full"
                  color="bg-fuschia-40"
                />
              </div>
              <div className="flex grow flex-col">
                <h1 className="inter-xlarge-semibold text-grey-90 max-w-[50%] truncate">
                  {customerName()}
                </h1>
                <h3 className="inter-small-regular text-grey-50">
                  {customer.customer.email}
                </h3>
              </div>
            </div>
            <Actionables actions={actions} forceDropdown />
          </div>
          <div className="mt-6 flex space-x-6 divide-x">
            {/* <div className="flex flex-col">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("store-credit-customer-details-first-seen", "First seen")}
              </div>
              <div>{moment(customer.created_at).format("DD MMM YYYY")}</div>
            </div> */}
            {/* <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("store-credit-customer-details-phone", "Phone")}
              </div>
              <div className="max-w-[200px] truncate">
                {customer.phone || "N/A"}
              </div>
            </div> */}
            {/* <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("store-credit-customer-details-orders", "Orders")}
              </div>
              <div>{customer.orders.length}</div>
            </div> */}
            {/* <div className="h-100 flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("store-credit-customer-details-user", "User")}
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
                {t(
                  "store-credit-customer-details-original-amount",
                  "Original amount"
                )}
              </div>
              <div>
                {formatAmountWithSymbol({
                  amount: customer.value,
                  currency: customer.region.currency_code,
                  digits: 2,
                })}
              </div>
            </div>
            <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("store-credit-customer-details-balance", "Balance")}
              </div>
              <div>
                {formatAmountWithSymbol({
                  amount: customer.balance,
                  currency: customer.region.currency_code,
                  digits: 2,
                })}
              </div>
            </div>
            <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("store-credit-customer-details-region", "Region")}
              </div>
              <div>{customer.region.name}</div>
            </div>
          </div>
        </Section>
        <BodyCard
          title={t(
            "store-credit-customer-details-store-credits",
            "Store Credits"
          )}
          subtitle={t(
            "store-credit-customer-details-an-overview-of-customer-orders",
            "An overview of customer store credits"
          )}
        >
          <div className="flex  grow flex-col">
            <CustomerStoreCreditsTable
              customerId={customer.customer.id}
              regionId={customer.region.id}
            />
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
          data={customer}
          title={t(
            "store-credit-customer-details-raw-customer",
            "Raw store credit customer"
          )}
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

export default CustomerDetail;

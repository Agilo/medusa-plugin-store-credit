import { Order } from "../../../../../../admin-client";
import Section from "../../../../../../admin-ui/ui/src/components/organisms/section";
import { formatAmountWithSymbol } from "../../../../../../admin-ui/ui/src/utils/prices";

type Props = {
  order: Order;
};

const StoreCreditsSection = ({ order }: Props) => {
  const storeCreditTotal = (order.store_credit_transactions || []).reduce(
    (acc, cur) => {
      return acc + cur.amount;
    },
    0,
  );

  return (
    <Section title="Store Credit">
      <div className="flex flex-col grow">
        <div className="mt-6">
          <div className="mt-4 flex justify-between">
            <div className="inter-small-semibold text-grey-90">
              Store credits used
            </div>
            <div className="flex">
              <div className="inter-small-semibold text-grey-90 mr-3">
                {formatAmountWithSymbol({
                  amount: storeCreditTotal,
                  currency: order.region.currency_code,
                  digits: 2,
                })}
              </div>
              <div className="inter-small-regular text-grey-50">
                {order.region.currency_code.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default StoreCreditsSection;

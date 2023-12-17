import { useCheckout } from "@lib/context/checkout-context"
import Spinner from "@modules/common/icons/spinner"
import { formatAmount } from "medusa-react"
import { useEffect } from "react"
import PaymentContainer from "../payment-container"
import StepContainer from "../step-container"

const Payment = () => {
  const {
    cart,
    setPaymentSession,
    initPayment,
    sameAsBilling: { state: isSame },
  } = useCheckout()

  /**
   * Fallback if the payment session are not loaded properly we
   * retry to load them after a 5 second delay.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (cart?.shipping_address && cart?.payment_sessions) {
      timeout = setTimeout(() => {
        initPayment()
      }, 5000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart])

  const noPaymentRequired = cart && cart.total === 0

  return (
    <StepContainer
      title="Payment"
      index={isSame ? 3 : 4}
      closedState={
        <div className="px-8 pb-8 text-small-regular">
          <p>Enter your address to see available payment options.</p>
        </div>
      }
    >
      <div>
        {noPaymentRequired ? (
          <div className="flex flex-col gap-y-4 border-b border-gray-200 last:border-b-0 bg-gray-50">
            <div className="grid grid-cols-[12px_1fr] gap-x-4 py-4 px-8">
              <div className="h-3 w-3 rounded-full border border-gray-200 flex items-center justify-center border-gray-900 invisible">
                <div className="w-2 h-2 rounded-full bg-gray-900" />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-base-semi leading-none text-gray-900">
                  No payment required
                </h3>
                <span className="text-gray-700 text-small-regular mt-2">
                  No payment required since your total is{" "}
                  {formatAmount({ amount: 0, region: cart.region })}.
                </span>
              </div>
            </div>
          </div>
        ) : cart?.payment_sessions?.length ? (
          cart.payment_sessions
            .sort((a, b) => {
              return a.provider_id > b.provider_id ? 1 : -1
            })
            .map((paymentSession) => {
              return (
                <PaymentContainer
                  paymentSession={paymentSession}
                  key={paymentSession.id}
                  selected={
                    cart?.payment_session?.provider_id ===
                    paymentSession.provider_id
                  }
                  setSelected={() =>
                    setPaymentSession(paymentSession.provider_id)
                  }
                />
              )
            })
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-gray-900">
            <Spinner />
          </div>
        )}
      </div>
    </StepContainer>
  )
}

export default Payment

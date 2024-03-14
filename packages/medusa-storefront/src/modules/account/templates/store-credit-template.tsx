"use client"

import { useAccount } from "@lib/context/account-context"
import { formatAmount, useRegions } from "medusa-react"

const StoreCreditTemplate = () => {
  const { customer, retrievingCustomer: customerIsLoading } = useAccount()
  const { regions, isLoading: regionsIsLoading } = useRegions()

  // TODO: Add store_credits definition to customer type
  // prettier-ignore
  // @ts-ignore
  const storeCredits = customer && customer.store_credits ? customer.store_credits.filter((sc) => sc.balance) : []

  if (customerIsLoading || !customer || regionsIsLoading || !regions) {
    return null
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Store Credit</h1>
        <p className="text-base-regular">View your store credit here.</p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex flex-col gap-y-4">
          <ul className="flex flex-col gap-y-4">
            {storeCredits.length ? (
              storeCredits.map((storeCredit: any) => {
                const region = regions.find(
                  (r) => r.id === storeCredit.region_id
                )

                if (!region) {
                  return null
                }

                return (
                  <li key={storeCredit.region_id}>
                    <div className="bg-gray-50 flex justify-between items-center p-4">
                      <div className="grid grid-cols-2 grid-rows-2 text-small-regular gap-x-4 flex-1">
                        <span className="font-semibold">Region</span>
                        <span className="font-semibold">Balance</span>
                        <span>
                          {region.name} (
                          {region.countries
                            .map((c) => c.display_name)
                            .join(", ")}
                          )
                        </span>
                        <span>
                          {formatAmount({
                            amount: storeCredit.balance,
                            region: region,
                            includeTaxes: false,
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })
            ) : (
              <span>You have no store credit</span>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StoreCreditTemplate

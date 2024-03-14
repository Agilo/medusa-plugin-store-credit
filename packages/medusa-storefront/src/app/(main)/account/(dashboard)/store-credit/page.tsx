import StoreCreditTemplate from "@modules/account/templates/store-credit-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Store Credit",
  description: "View your store credit.",
}

export default function StoreCredit() {
  return <StoreCreditTemplate />
}

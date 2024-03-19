import {
  Cart as MedusaCart,
  Customer as MedusaCustomer,
  Order as MedusaOrder,
  Product as MedusaProduct,
  Region as MedusaRegion,
  ProductVariant,
} from "@medusajs/medusa"

export type Variant = Omit<ProductVariant, "beforeInsert">

export interface Product extends Omit<MedusaProduct, "variants"> {
  variants: Variant[]
}

export interface Region extends Omit<MedusaRegion, "beforeInsert"> {}

export type CalculatedVariant = ProductVariant & {
  calculated_price: number
  calculated_price_type: "sale" | "default"
  original_price: number
}

export interface RegionStoreCredit {
  region_id: string
  balance: number
}

export interface Cart extends Omit<MedusaCart, "beforeInsert"> {
  store_credit_total?: number
}

export interface Customer extends Omit<MedusaCustomer, "beforeInsert"> {
  store_credits?: RegionStoreCredit[]
}

export interface Order extends Omit<MedusaOrder, "beforeInsert"> {
  store_credit_total?: number
}

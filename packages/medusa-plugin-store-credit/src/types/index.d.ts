import { RegionStoreCredit } from "../models/customer";
import { StoreCredit } from "../models/store-credit";
import { StoreCreditTransaction } from "../models/store-credit-transaction";

export declare module "@medusajs/medusa/dist/models/cart" {
  declare interface Cart {
    store_credit_total?: number;
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    store_credits?: RegionStoreCredit[];
  }
}

export declare module "@medusajs/medusa/dist/models/order" {
  declare interface Order {
    store_credits?: StoreCredit[];
    store_credit_transactions?: StoreCreditTransaction[];
    store_credit_total?: number;
  }
}

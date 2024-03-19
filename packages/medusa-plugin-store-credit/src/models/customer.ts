import { Entity } from "typeorm";
import { Customer as MedusaCustomer } from "@medusajs/medusa";

export interface RegionStoreCredit {
  region_id: string;
  balance: number;
}

@Entity()
export class Customer extends MedusaCustomer {
  store_credits?: RegionStoreCredit[];
}

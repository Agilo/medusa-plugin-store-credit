import { Entity } from "typeorm";
import { Customer as MedusaCustomer } from "@medusajs/medusa";

interface RegionStoreCredit {
  region_id: string;
  balance: number;
}

@Entity()
export class Customer extends MedusaCustomer {
  store_credit?: RegionStoreCredit[];
}
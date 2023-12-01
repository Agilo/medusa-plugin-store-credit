import { Cart as MedusaCart } from "@medusajs/medusa";
import { Entity } from "typeorm";

@Entity()
export class Cart extends MedusaCart {
  store_credit_total?: number;
}

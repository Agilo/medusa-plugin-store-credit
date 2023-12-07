import { Order as MedusaOrder } from "@medusajs/medusa";
import { Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { StoreCredit } from "./store-credit";
import { StoreCreditTransaction } from "./store-credit-transaction";

@Entity()
export class Order extends MedusaOrder {
  @ManyToMany(() => StoreCredit, { cascade: ["insert"] })
  @JoinTable({
    name: "order_store_credits",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "store_credit_id",
      referencedColumnName: "id",
    },
  })
  store_credits: StoreCredit[];

  @OneToMany(() => StoreCreditTransaction, (sc) => sc.order)
  store_credit_transactions: StoreCreditTransaction[];

  store_credit_total: number;
  // store_credit_tax_total: number
}

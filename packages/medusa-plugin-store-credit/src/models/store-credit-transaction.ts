import { Order, generateEntityId, resolveDbType } from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from "typeorm";
import { StoreCredit } from "./store-credit";

@Unique("stcreduniq", ["store_credit_id", "order_id"])
@Entity()
export class StoreCreditTransaction {
  @PrimaryColumn()
  id: string;

  @Column()
  store_credit_id: string;

  @ManyToOne(() => StoreCredit, (sc) => sc.store_credit_transactions)
  @JoinColumn({ name: "store_credit_id" })
  store_credit: StoreCredit;

  @Index()
  @Column()
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order;

  @Column("int")
  amount: number;

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "stcredt");
  }
}

/**
 * @schema StoreCreditTransaction
 * title: "Store Credit Transaction"
 * description: "Store Credit Transactions are created once a Customer uses Store Credit to pay for their Order."
 * type: object
 * required:
 *   - amount
 *   - created_at
 *   - id
 *   - order_id
 *   - store_credit_id
 * properties:
 *   id:
 *     description: The store credit transaction's ID
 *     type: string
 *     example: stcredt_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   store_credit_id:
 *     description: The ID of the Store Credit that was used in the transaction.
 *     type: string
 *     example: stcred_01G8XKBPBQY2R7RBET4J7E0XQZ
 *   store_credit:
 *     description: The details of the store credit associated used in this transaction.
 *     x-expandable: "store_credit"
 *     nullable: true
 *     $ref: "#/components/schemas/StoreCredit"
 *   order_id:
 *     description: The ID of the order that the store credit was used for payment.
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: The details of the order that the store credit was used for payment.
 *     x-expandable: "order"
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   amount:
 *     description: The amount that was used from the Store Credit.
 *     type: integer
 *     example: 10
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 */

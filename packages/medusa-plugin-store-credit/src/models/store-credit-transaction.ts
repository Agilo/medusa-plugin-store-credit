import { Order, generateEntityId } from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from "typeorm";
import { StoreCredit } from "./store-credit";
// import { Order } from "./order"
// import { generateEntityId } from "../utils/generate-entity-id"
// import { resolveDbType } from "../utils/db-aware-column"

@Unique("stcreduniq", ["store_credit_id", "order_id"])
@Entity()
export class StoreCreditTransaction {
  @PrimaryColumn()
  id: string;

  @Column()
  store_credit_id: string;

  @ManyToOne(() => StoreCredit)
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

  // @CreateDateColumn({ type: resolveDbType("timestamptz") })
  // created_at: Date;

  // @Column({ nullable: true })
  // is_taxable: boolean;

  // @Column({ type: "real", nullable: true })
  // tax_rate: number | null;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "stcredt");
  }
}

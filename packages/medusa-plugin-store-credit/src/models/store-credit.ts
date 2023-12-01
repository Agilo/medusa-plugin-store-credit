import {
  Customer,
  SoftDeletableEntity,
  generateEntityId,
} from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";
// import { Order } from "./order";
// import { Region } from "./region";
// import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column";
// import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity";
// import { generateEntityId } from "../utils/generate-entity-id";

@Entity()
export class StoreCredit extends SoftDeletableEntity {
  // @Index({ unique: true })
  // @Column()
  // code: string;

  @Column("int")
  value: number;

  @Column("int")
  balance: number;

  // @Index()
  // @Column()
  // region_id: string;

  // @ManyToOne(() => Region)
  // @JoinColumn({ name: "region_id" })
  // region: Region;

  @Index()
  @Column()
  customer_id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  // @Index()
  // @Column({ nullable: true })
  // order_id: string;

  // @ManyToOne(() => Order)
  // @JoinColumn({ name: "order_id" })
  // order: Order;

  // @Column({ default: false })
  // is_disabled: boolean;

  // @Column({
  //   type: resolveDbType("timestamptz"),
  //   nullable: true,
  // })
  // ends_at: Date;

  // @Column({ type: "real", nullable: true })
  // tax_rate: number | null;

  // @DbAwareColumn({ type: "jsonb", nullable: true })
  // metadata: Record<string, unknown>;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "stcred");
  }
}

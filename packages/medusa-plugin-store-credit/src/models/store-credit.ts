import {
  Customer,
  DbAwareColumn,
  Region,
  SoftDeletableEntity,
  generateEntityId,
  resolveDbType,
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
  @Column("int")
  value: number;

  @Column("int")
  balance: number;

  @Column({ type: "varchar" })
  description: string | null;

  @Index()
  @Column()
  region_id: string;

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region;

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

  @Column({ default: false })
  is_disabled: boolean;

  @Column({
    type: resolveDbType("timestamptz"),
    nullable: true,
  })
  ends_at: Date;

  // @Column({ type: "real", nullable: true })
  // tax_rate: number | null;

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "stcred");
  }
}

/**
 * @schema StoreCredit
 * title: "StoreCredit"
 * description: "Store credit."
 * type: object
 * required:
 *   - balance
 *   - customer
 *   - customer_id
 *   - description
 *   - ends_at
 *   - id
 *   - is_disabled
 *   - metadata
 *   - region
 *   - region_id
 *   - value
 * properties:
 *   id:
 *     description: The store credit's ID
 *     type: string
 *     example: stcred_01G1G5V2MBA328390B5AXJ610F
 *   value:
 *     description: Original store credit value.
 *     type: number
 *     example: 1000
 *   balance:
 *     description: Current store credit value.
 *     type: number
 *     example: 500
 *   description:
 *     description: A short description of the Store Credit.
 *     nullable: true
 *     type: string
 *     example: Refund for order xyz.
 *   region_id:
 *     description: The ID of the region this store credit was created in.
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: The details of the region this store credit was created in.
 *     x-expandable: "region"
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   customer_id:
 *     description: The ID of the customer associated with the store credit.
 *     type: string
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   customer:
 *     description: The details of the customer associated with the store credit.
 *     x-expandable: "customer"
 *     nullable: true
 *     $ref: "#/components/schemas/Customer"
 *   is_disabled:
 *     description: Whether the Store Credit has been disabled. Disabled Store Credits cannot be applied to carts.
 *     type: boolean
 *     default: false
 *   ends_at:
 *     description: The time at which the Store Credit can no longer be used.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */

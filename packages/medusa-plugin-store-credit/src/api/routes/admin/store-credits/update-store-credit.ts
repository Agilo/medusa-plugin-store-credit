import { validator } from "@medusajs/medusa";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [post] /admin/store-credits/{id}
 * operationId: "AdminPostStoreCreditsStoreCredit"
 * summary: "Update Store Credit"
 * description: "Update Store Credits's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Store Credit.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostStoreCreditsStoreCreditReq"
 * x-codegen:
 *   method: update
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - StoreCredits
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStoreCreditsRes"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params;

  const validated = await validator(
    AdminPostStoreCreditsStoreCreditReq,
    req.body
  );

  // TODO: make sure balance is not greater than original amount

  const storeCreditService: StoreCreditService =
    req.scope.resolve("storeCreditService");
  const manager: EntityManager = req.scope.resolve("manager");

  const updated = await manager.transaction(async (transactionManager) => {
    return await storeCreditService
      .withTransaction(transactionManager)
      .update(id, validated);
  });

  const storeCredit = await storeCreditService.retrieve(
    updated.id
    // {},
    // {
    //   relations: ["products"],
    // }
  );

  res.status(200).json({ store_credit: storeCredit });
};

/**
 * @schema AdminPostStoreCreditsStoreCreditReq
 * type: object
 * properties:
 *   balance:
 *     type: integer
 *     description: Balance (excluding VAT) that the Store Credit should represent, can't be greater than original amount.
 *   ends_at:
 *     type: string
 *     format: date-time
 *     description: The date and time at which the Store Credit should no longer be available.
 *   is_disabled:
 *     type: boolean
 *     description: >-
 *       Whether the Store Credit is disabled.
 *   description:
 *     type: string
 *     description: The description of the Store Credit.
 *   metadata:
 *     type: object
 *     description: An optional set of key-value pairs to hold additional information.
 */
export class AdminPostStoreCreditsStoreCreditReq {
  @IsOptional()
  @IsInt()
  balance?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ends_at?: Date;

  @IsOptional()
  @IsBoolean()
  is_disabled?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

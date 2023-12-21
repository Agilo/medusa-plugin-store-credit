import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import StoreCreditService from "../../../../services/store-credit";

/**
 * @oas [post] /admin/store-credits
 * operationId: "AdminPostStoreCredits"
 * summary: "Create Store Credit"
 * x-authenticated: true
 * description: "Create new Store Credit."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostStoreCreditsReq"
 * x-codegen:
 *   method: create
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
export default async (req, res: Response) => {
  const validatedBody: AdminPostStoreCreditsReq & { balance: number } =
    req.validatedBody;
  validatedBody.balance = validatedBody.value;

  const storeCreditService: StoreCreditService =
    req.scope.resolve("storeCreditService");
  const manager: EntityManager = req.scope.resolve("manager");

  const created = await manager.transaction(async (transactionManager) => {
    return await storeCreditService
      .withTransaction(transactionManager)
      .create(validatedBody);
  });

  const storeCredit = await storeCreditService.retrieve(created.id);

  res.status(200).json({
    storeCredit,
  });
};

/**
 * @schema AdminPostStoreCreditsReq
 * type: object
 * required:
 *   - value
 *   - region_id
 *   - customer_id
 * properties:
 *   value:
 *     type: integer
 *     description: The value (excluding VAT) that the Store Credit should represent.
 *   ends_at:
 *     type: string
 *     format: date-time
 *     description: The date and time at which the Store Credit should no longer be available.
 *   is_disabled:
 *     type: boolean
 *     description: >-
 *       Whether the Store Credit is disabled on creation.
 *   region_id:
 *     type: string
 *     description: The ID of the Region in which the Store Credit can be used.
 *   customer_id:
 *     type: string
 *     description: The ID of the customer this Store Credit is associated with.
 *   description:
 *     type: string
 *     description: The description of the Bundle.
 *   metadata:
 *     type: object
 *     description: An optional set of key-value pairs to hold additional information.
 */
export class AdminPostStoreCreditsReq {
  @IsInt()
  value: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ends_at?: Date;

  @IsOptional()
  @IsBoolean()
  is_disabled?: boolean;

  @IsString()
  region_id: string;

  @IsString()
  customer_id: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

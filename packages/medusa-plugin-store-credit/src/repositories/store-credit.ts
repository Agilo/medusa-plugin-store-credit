import { ExtendedFindConfig } from "@medusajs/medusa";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { promiseAll } from "@medusajs/utils";
import { Brackets, FindOptionsWhere, Repository } from "typeorm";
import { StoreCredit } from "../models/store-credit";

// import { FindOptionsWhere, ILike, Raw } from "typeorm"
// import { GiftCard } from "../models"
// import { ExtendedFindConfig } from "../types/common"
// import { dataSource } from "../loaders/database"
// import { promiseAll } from "@medusajs/utils"

export const StoreCreditRepository = dataSource
  .getRepository(StoreCredit)
  .extend({
    async listAndCount(
      query: ExtendedFindConfig<StoreCredit>
      // q?: string
    ): Promise<[StoreCredit[], number]> {
      const query_ = { ...query };
      query_.where = query_.where as FindOptionsWhere<StoreCredit>;

      return await promiseAll([this.find(query_), this.count(query_)]);
    },
    async getValidStoreCredits(customerId: string): Promise<StoreCredit[]> {
      const date = new Date();

      const qb = (this as Repository<StoreCredit>)
        .createQueryBuilder("store_credit")
        // .select([`store_credit.id`])
        .where("customer_id = :customerId", { customerId })
        .andWhere("is_disabled = false")
        .andWhere("balance > 0")
        .andWhere(
          new Brackets((qb) => {
            qb.where(`ends_at IS NULL`).orWhere(`ends_at > :date`, {
              date: date.toUTCString(),
            });
          })
        );

      return qb.getMany();
    },
    async getValidStoreCreditsForRegion(
      customerId: string,
      regionId: string
    ): Promise<StoreCredit[]> {
      const date = new Date();

      const qb = (this as Repository<StoreCredit>)
        .createQueryBuilder("store_credit")
        // .select([`store_credit.id`])
        .where("customer_id = :customerId", { customerId })
        .andWhere("region_id = :regionId", { regionId })
        .andWhere("is_disabled = false")
        .andWhere("balance > 0")
        .andWhere(
          new Brackets((qb) => {
            qb.where(`ends_at IS NULL`).orWhere(`ends_at > :date`, {
              date: date.toUTCString(),
            });
          })
        );

      return qb.getMany();
    },
  });
export default StoreCreditRepository;

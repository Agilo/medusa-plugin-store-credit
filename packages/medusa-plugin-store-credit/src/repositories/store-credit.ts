import { ExtendedFindConfig } from "@medusajs/medusa";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { promiseAll } from "@medusajs/utils";
import { FindOptionsWhere } from "typeorm";
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

      // if (q) {
      //   delete query_.where.id

      //   query_.relations = query_.relations ?? {}
      //   query_.relations.order = query_.relations.order ?? true

      //   query_.where = query_.where as FindOptionsWhere<GiftCard>[]
      //   query_.where = [
      //     {
      //       ...query_.where,
      //       code: ILike(`%${q}%`),
      //     },
      //     {
      //       ...query_.where,
      //       order: {
      //         display_id: Raw((alias) => `CAST(${alias} as varchar) ILike :q`, {
      //           q: `%${q}%`,
      //         }),
      //       },
      //     },
      //   ]
      // }

      return await promiseAll([this.find(query_), this.count(query_)]);
    },
  });
export default StoreCreditRepository;

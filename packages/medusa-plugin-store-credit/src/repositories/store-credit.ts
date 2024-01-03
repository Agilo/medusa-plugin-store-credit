import { ExtendedFindConfig } from "@medusajs/medusa";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { promiseAll } from "@medusajs/utils";
import { Brackets, FindOptionsWhere, Repository } from "typeorm";
import { StoreCredit } from "../models/store-credit";

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
    async listAndCountCustomers(
      selector: { q?: string } = {},
      config: { skip: number; take: number } = { skip: 0, take: 10 }
    ): Promise<
      [
        {
          customer_id: string;
          region_id: string;
          amount: number;
          balance: number;
        }[],
        number
      ]
    > {
      const date = new Date();

      // console.log("repo::selector", selector);
      // console.log("repo::config", config);

      /**
       * Query looks something like this:
       *
       * SELECT
       *   "store_credit"."customer_id" AS customer_id,
       *   "store_credit"."region_id" AS region_id,
       *   SUM("store_credit"."value") FILTER (WHERE is_disabled = false AND (ends_at IS NULL OR ends_at > :date)) AS "amount",
       *   SUM("store_credit"."balance") FILTER (WHERE is_disabled = false AND (ends_at IS NULL OR ends_at > :date)) AS "balance"
       * FROM
       *   "public"."store_credit" "store_credit"
       * LEFT JOIN
       *   "public"."customer" "customers" ON "customers"."id"="store_credit"."customer_id"
       *   AND ("customers"."deleted_at" IS NULL)
       * WHERE
       *   "store_credit"."deleted_at" IS NULL
       * GROUP BY
       *   "store_credit"."customer_id", "store_credit"."region_id"
       * ORDER BY amount DESC LIMIT 10 OFFSET 0
       */

      const qb = (this as Repository<StoreCredit>)
        .createQueryBuilder("store_credit")
        .leftJoinAndMapOne(
          "store_credit.customer",
          "store_credit.customer",
          "customers"
        )
        .select([
          "store_credit.customer_id AS customer_id",
          "store_credit.region_id AS region_id",
          // "COUNT(DISTINCT store_credit.customer_id,store_credit.region_id) AS count", // function count(character varying, character varying) does not exist
        ])
        .addSelect(
          "SUM(store_credit.value) FILTER (WHERE is_disabled = false AND (ends_at IS NULL OR ends_at > :date))",
          "amount"
        )
        .addSelect(
          "SUM(store_credit.balance) FILTER (WHERE is_disabled = false AND (ends_at IS NULL OR ends_at > :date))",
          "balance"
        )
        .setParameter("date", date.toUTCString())
        .groupBy("store_credit.customer_id")
        .addGroupBy("store_credit.region_id")
        .orderBy("amount", "DESC");

      if (selector.q) {
        qb.where(
          new Brackets((qb) => {
            qb.where(`customers.email ILIKE :q`, { q: `%${selector.q}%` });
            qb.orWhere(`customers.first_name ILIKE :q`, {
              q: `%${selector.q}%`,
            });
            qb.orWhere(`customers.last_name ILIKE :q`, {
              q: `%${selector.q}%`,
            });
          })
        );
      }

      // get count for the main query

      const [query, parameters] = qb.getQueryAndParameters();

      const qbCount = await (this as Repository<StoreCredit>).query(
        `SELECT COUNT(*) AS count FROM (${query});`,
        parameters
      );

      console.log("qbCount", qbCount);
      const count = parseInt(qbCount[0].count, 10);

      // add skip and take to the main query

      qb.offset(config.skip).limit(config.take);

      console.log("qb.getQuery()", qb.getQuery());
      console.log("qb.getQueryAndParameters()", qb.getQueryAndParameters());

      const customers = await qb.getRawMany();

      console.log("count", count);
      console.log("customers", customers);

      return [customers, count];
    },
  });
export default StoreCreditRepository;

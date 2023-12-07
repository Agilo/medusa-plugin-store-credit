import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { StoreCreditTransaction } from "../models/store-credit-transaction";

export const StoreCreditTransactionRepository = dataSource.getRepository(
  StoreCreditTransaction
);
export default StoreCreditTransactionRepository;

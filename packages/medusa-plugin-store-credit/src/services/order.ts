import { OrderService as MedusaOrderService, isString } from "@medusajs/medusa";
import { Cart } from "../models/cart";
import { Order } from "../models/order";
import NewTotalsService from "./new-totals";
import StoreCreditService from "./store-credit";

class OrderService extends MedusaOrderService {
  protected readonly storeCreditService_: StoreCreditService;

  constructor({ storeCreditService }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.storeCreditService_ = storeCreditService;
  }

  protected transformQueryForTotals(config: any): any {
    const result = super.transformQueryForTotals(config);
    let { relations } = result;

    if (
      relations &&
      Array.isArray(relations) &&
      relations.length &&
      // relations.includes("gift_cards") &&
      // relations.includes("gift_card_transactions") &&
      !relations.includes("store_credits") &&
      !relations.includes("store_credit_transactions")
    ) {
      relations.push("store_credits");
      relations.push("store_credit_transactions");
    }

    console.log("order.ts::transformQueryForTotals::config", config);
    console.log("order.ts::transformQueryForTotals::result", result);
    return result;
  }

  /**
   * Creates an order from a cart
   * @return resolves to the creation result.
   * @param cartOrId
   */
  async createFromCart(cartOrId: string | Cart): Promise<Order | never> {
    return await this.atomicPhase_(async (manager) => {
      const cartService = this.cartService_.withTransaction(manager);
      const orderRepo = manager.withRepository(this.orderRepository_);
      const storeCreditService =
        this.storeCreditService_.withTransaction(manager);

      const cart = isString(cartOrId)
        ? await cartService.retrieveWithTotals(cartOrId, {
            relations: ["region", "payment", "items"],
          })
        : cartOrId;

      const order = await super.createFromCart(cartOrId);

      let storeCreditableAmountBalance = cart.store_credit_total ?? 0;

      const storeCredits =
        await storeCreditService.getValidStoreCreditsForRegion(
          cart.customer_id,
          cart.region_id,
        );

      // Order the store credit by first ends_at date, then remaining amount. To ensure largest possible amount left, for longest possible time.
      const orderedStoreCredits = storeCredits.sort((a, b) => {
        const aEnd = a.ends_at ?? new Date(2100, 1, 1);
        const bEnd = b.ends_at ?? new Date(2100, 1, 1);
        return aEnd.getTime() - bEnd.getTime() || a.balance - b.balance;
      });

      for (const storeCredit of orderedStoreCredits) {
        const newStoreCreditBalance = Math.max(
          0,
          storeCredit.balance - storeCreditableAmountBalance,
        );
        const storeCreditBalanceUsed =
          storeCredit.balance - newStoreCreditBalance;

        await storeCreditService.update(storeCredit.id, {
          balance: newStoreCreditBalance,
          is_disabled: newStoreCreditBalance === 0,
        });

        await storeCreditService.createTransaction({
          store_credit_id: storeCredit.id,
          order_id: order.id,
          amount: storeCreditBalanceUsed,
          // is_taxable: !!giftCard.tax_rate,
          // tax_rate: giftCard.tax_rate,
        });

        storeCreditableAmountBalance -= storeCreditBalanceUsed;

        // @ts-ignore
        order.store_credits = [...(order.store_credits ?? []), storeCredit];

        if (storeCreditableAmountBalance == 0) {
          break;
        }
      }

      const result = await orderRepo.save(order);

      return result;
    });
  }

  /**
   * Calculate and attach the different total fields on the object
   */
  async decorateTotals(order: Order, totalsFieldsOrContext?): Promise<Order> {
    const order_ = (await super.decorateTotals(
      order,
      totalsFieldsOrContext,
    )) as Order;

    if (Array.isArray(totalsFieldsOrContext)) {
      if (totalsFieldsOrContext.length) {
        // this.decorateTotalsLegacy() should have decorated the totals already
        return order_;
      }
      totalsFieldsOrContext = {};
    }

    return await this.decorateStoreCreditTotals(order_);
  }

  async decorateStoreCreditTotals(order: Order): Promise<Order> {
    const newTotalsService = this.newTotalsService_ as NewTotalsService;

    const storeCreditableAmount = newTotalsService.getStoreCreditableAmount(
      order.total,
    );

    // console.log('order.ts::decorateTotals::order.store_credits', order.store_credits);
    // console.log('order.ts::decorateTotals::order.store_credit_transactions', order.store_credit_transactions);

    const storeCreditTotal = await newTotalsService.getStoreCreditTotals(
      storeCreditableAmount,
      {
        storeCredits: order.store_credits,
        storeCreditTransactions: order.store_credit_transactions ?? [],
      },
    );
    order.store_credit_total = storeCreditTotal;

    // prettier-ignore
    order.total =
      order.subtotal +
      order.shipping_total +
      order.tax_total -
      (order.gift_card_total + order.discount_total + order.store_credit_total)

    return order;
  }
}

export default OrderService;

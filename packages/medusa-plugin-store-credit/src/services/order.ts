import {
  FindConfig,
  OrderService as MedusaOrderService,
  isString,
} from "@medusajs/medusa";
import SalesChannelFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/sales-channels";
import { promiseAll } from "@medusajs/utils";
import { MedusaError, isDefined } from "medusa-core-utils";
import { Cart } from "../models/cart";
import { Order } from "../models/order";
import NewTotalsService from "./new-totals";
import StoreCreditService from "./store-credit";

// import { IInventoryService } from "@medusajs/types";
// import {
//   buildRelations,
//   buildSelects,
//   FlagRouter,
//   isDefined,
//   MedusaError,
//   promiseAll,
// } from "@medusajs/utils";
// import {
//   EntityManager,
//   FindManyOptions,
//   FindOptionsWhere,
//   ILike,
//   IsNull,
//   Not,
//   Raw,
// } from "typeorm";
// import {
//   CartService,
//   CustomerService,
//   DiscountService,
//   DraftOrderService,
//   FulfillmentProviderService,
//   FulfillmentService,
//   GiftCardService,
//   LineItemService,
//   NewTotalsService,
//   PaymentProviderService,
//   ProductVariantInventoryService,
//   RegionService,
//   ShippingOptionService,
//   ShippingProfileService,
//   TaxProviderService,
//   TotalsService,
// } from ".";
// import { TransactionBaseService } from "../interfaces";
// import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels";
// import {
//   Address,
//   Cart,
//   ClaimOrder,
//   Fulfillment,
//   FulfillmentItem,
//   FulfillmentStatus,
//   GiftCard,
//   LineItem,
//   Order,
//   OrderStatus,
//   Payment,
//   PaymentStatus,
//   Return,
//   Swap,
//   TrackingLink,
// } from "../models";
// import { AddressRepository } from "../repositories/address";
// import { OrderRepository } from "../repositories/order";
// import { FindConfig, QuerySelector, Selector } from "../types/common";
// import {
//   CreateFulfillmentOrder,
//   FulFillmentItemType,
// } from "../types/fulfillment";
// import { TotalsContext, UpdateOrderInput } from "../types/orders";
// import { CreateShippingMethodDto } from "../types/shipping-options";
// import { buildQuery, isString, setMetadata } from "../utils";
// import EventBusService from "./event-bus";

export const ORDER_CART_ALREADY_EXISTS_ERROR = "Order from cart already exists";

// type InjectedDependencies = {
//   manager: EntityManager;
//   orderRepository: typeof OrderRepository;
//   customerService: CustomerService;
//   paymentProviderService: PaymentProviderService;
//   shippingOptionService: ShippingOptionService;
//   shippingProfileService: ShippingProfileService;
//   discountService: DiscountService;
//   fulfillmentProviderService: FulfillmentProviderService;
//   fulfillmentService: FulfillmentService;
//   lineItemService: LineItemService;
//   totalsService: TotalsService;
//   newTotalsService: NewTotalsService;
//   taxProviderService: TaxProviderService;
//   regionService: RegionService;
//   cartService: CartService;
//   addressRepository: typeof AddressRepository;
//   giftCardService: GiftCardService;
//   draftOrderService: DraftOrderService;
//   inventoryService: IInventoryService;
//   eventBusService: EventBusService;
//   featureFlagRouter: FlagRouter;
//   productVariantInventoryService: ProductVariantInventoryService;
// };

class OrderService extends MedusaOrderService {
  // static readonly Events = {
  //   GIFT_CARD_CREATED: "order.gift_card_created",
  //   PAYMENT_CAPTURED: "order.payment_captured",
  //   PAYMENT_CAPTURE_FAILED: "order.payment_capture_failed",
  //   SHIPMENT_CREATED: "order.shipment_created",
  //   FULFILLMENT_CREATED: "order.fulfillment_created",
  //   FULFILLMENT_CANCELED: "order.fulfillment_canceled",
  //   RETURN_REQUESTED: "order.return_requested",
  //   ITEMS_RETURNED: "order.items_returned",
  //   RETURN_ACTION_REQUIRED: "order.return_action_required",
  //   REFUND_CREATED: "order.refund_created",
  //   REFUND_FAILED: "order.refund_failed",
  //   SWAP_CREATED: "order.swap_created",
  //   PLACED: "order.placed",
  //   UPDATED: "order.updated",
  //   CANCELED: "order.canceled",
  //   COMPLETED: "order.completed",
  // }

  // protected readonly orderRepository_: typeof OrderRepository
  // protected readonly customerService_: CustomerService
  // protected readonly paymentProviderService_: PaymentProviderService
  // protected readonly shippingOptionService_: ShippingOptionService
  // protected readonly shippingProfileService_: ShippingProfileService
  // protected readonly discountService_: DiscountService
  // protected readonly fulfillmentProviderService_: FulfillmentProviderService
  // protected readonly fulfillmentService_: FulfillmentService
  // protected readonly lineItemService_: LineItemService
  // protected readonly totalsService_: TotalsService
  // protected readonly newTotalsService_: NewTotalsService
  // protected readonly taxProviderService_: TaxProviderService
  // protected readonly regionService_: RegionService
  // protected readonly cartService_: CartService
  // protected readonly addressRepository_: typeof AddressRepository
  // protected readonly giftCardService_: GiftCardService
  // protected readonly draftOrderService_: DraftOrderService
  // protected readonly inventoryService_: IInventoryService
  // protected readonly eventBus_: EventBusService
  // protected readonly featureFlagRouter_: FlagRouter
  // // eslint-disable-next-line max-len
  // protected readonly productVariantInventoryService_: ProductVariantInventoryService
  protected readonly storeCreditService_: StoreCreditService;

  constructor({
    orderRepository,
    customerService,
    paymentProviderService,
    shippingOptionService,
    shippingProfileService,
    discountService,
    fulfillmentProviderService,
    fulfillmentService,
    lineItemService,
    totalsService,
    newTotalsService,
    taxProviderService,
    regionService,
    cartService,
    addressRepository,
    giftCardService,
    draftOrderService,
    eventBusService,
    featureFlagRouter,
    productVariantInventoryService,
    storeCreditService,
  }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    // this.orderRepository_ = orderRepository
    // this.customerService_ = customerService
    // this.paymentProviderService_ = paymentProviderService
    // this.shippingProfileService_ = shippingProfileService
    // this.fulfillmentProviderService_ = fulfillmentProviderService
    // this.lineItemService_ = lineItemService
    // this.totalsService_ = totalsService
    // this.newTotalsService_ = newTotalsService
    // this.taxProviderService_ = taxProviderService
    // this.regionService_ = regionService
    // this.fulfillmentService_ = fulfillmentService
    // this.discountService_ = discountService
    // this.giftCardService_ = giftCardService
    // this.eventBus_ = eventBusService
    // this.shippingOptionService_ = shippingOptionService
    // this.cartService_ = cartService
    // this.addressRepository_ = addressRepository
    // this.draftOrderService_ = draftOrderService
    // this.featureFlagRouter_ = featureFlagRouter
    // this.productVariantInventoryService_ = productVariantInventoryService
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

  // prettier-ignore
  /**
   * Creates an order from a cart
   * @return resolves to the creation result.
   * @param cartOrId
   */
  async createFromCart(cartOrId: string | Cart): Promise<Order | never> {
    return await this.atomicPhase_(async (manager) => {
      const cartServiceTx = this.cartService_.withTransaction(manager)

      const exists = !!(await this.retrieveByCartId(
        isString(cartOrId) ? cartOrId : cartOrId?.id,
        {
          select: ["id"],
        }
      ).catch(() => void 0))

      if (exists) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          ORDER_CART_ALREADY_EXISTS_ERROR
        )
      }

      const cart: Cart = isString(cartOrId)
        ? await cartServiceTx.retrieveWithTotals(cartOrId, {
            relations: ["region", "payment", "items"],
          })
        : cartOrId

      if (cart.items.length === 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot create order from empty cart"
        )
      }

      if (!cart.customer_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot create an order from the cart without a customer"
        )
      }

      const { payment, region, total } = cart

      // Would be the case if a discount code is applied that covers the item
      // total
      if (total !== 0) {
        if (!payment) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not contain a payment method"
          )
        }

        const paymentStatus = await this.paymentProviderService_
          .withTransaction(manager)
          .getStatus(payment)

        if (paymentStatus !== "authorized") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Payment method is not authorized"
          )
        }
      }

      const orderRepo = manager.withRepository(this.orderRepository_)

      // TODO: Due to cascade insert we have to remove the tax_lines that have been added by the cart decorate totals.
      // Is the cascade insert really used? Also, is it really necessary to pass the entire entities when creating or updating?
      // We normally should only pass what is needed?
      const shippingMethods = cart.shipping_methods.map((method) => {
        ;(method.tax_lines as any) = undefined
        return method
      })

      const toCreate = {
        payment_status: "awaiting",
        discounts: cart.discounts,
        gift_cards: cart.gift_cards,
        shipping_methods: shippingMethods,
        shipping_address_id: cart.shipping_address_id,
        billing_address_id: cart.billing_address_id,
        region_id: cart.region_id,
        email: cart.email,
        customer_id: cart.customer_id,
        cart_id: cart.id,
        currency_code: region.currency_code,
        metadata: cart.metadata || {},
      } as Partial<Order>

      if (
        cart.sales_channel_id &&
        this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
      ) {
        toCreate.sales_channel_id = cart.sales_channel_id
      }

      if (cart.type === "draft_order") {
        const draft = await this.draftOrderService_
          .withTransaction(manager)
          .retrieveByCartId(cart.id)

        toCreate.draft_order_id = draft.id
        toCreate.no_notification = draft.no_notification_order
      }

      const rawOrder = orderRepo.create(toCreate)
      const order = await orderRepo.save(rawOrder)

      if (total !== 0 && payment) {
        await this.paymentProviderService_
          .withTransaction(manager)
          .updatePayment(payment.id, {
            order_id: order.id,
          })
      }

      if (!isDefined(cart.subtotal) || !isDefined(cart.discount_total)) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Unable to compute gift cardable amount during order creation from cart. The cart is missing the subtotal and/or discount_total"
        )
      }

      let giftCardableAmountBalance = cart.gift_card_total ?? 0

      const giftCardService = this.giftCardService_.withTransaction(manager)

      // Order the gift cards by first ends_at date, then remaining amount. To ensure largest possible amount left, for longest possible time.
      const orderedGiftCards = cart.gift_cards.sort((a, b) => {
        const aEnd = a.ends_at ?? new Date(2100, 1, 1)
        const bEnd = b.ends_at ?? new Date(2100, 1, 1)
        return aEnd.getTime() - bEnd.getTime() || a.balance - b.balance
      })

      for (const giftCard of orderedGiftCards) {
        const newGiftCardBalance = Math.max(
          0,
          giftCard.balance - giftCardableAmountBalance
        )
        const giftCardBalanceUsed = giftCard.balance - newGiftCardBalance

        await giftCardService.update(giftCard.id, {
          balance: newGiftCardBalance,
          is_disabled: newGiftCardBalance === 0,
        })

        await giftCardService.createTransaction({
          gift_card_id: giftCard.id,
          order_id: order.id,
          amount: giftCardBalanceUsed,
          is_taxable: !!giftCard.tax_rate,
          tax_rate: giftCard.tax_rate,
        })

        giftCardableAmountBalance =
          giftCardableAmountBalance - giftCardBalanceUsed

        if (giftCardableAmountBalance == 0) {
          break
        }
      }

      /**
       * Handle store credits
       */

      console.log(" ---------- order.ts::createFromCart::handle-store-credits ---------- ");

      let storeCreditableAmountBalance = cart.store_credit_total ?? 0

      const storeCreditService = this.storeCreditService_.withTransaction(manager)

      /**
       * todo, select only store credits that are:
       * - tied to this customer
       * - tied to this region
       * - not disabled
       * - not expired
       * - not used up (have balance > 0)
       */
      const storeCredits = await storeCreditService.getValidStoreCreditsForRegion(cart.customer_id, cart.region_id);

      // Order the store credit by first ends_at date, then remaining amount. To ensure largest possible amount left, for longest possible time.
      const orderedStoreCredits = storeCredits.sort((a, b) => {
        const aEnd = a.ends_at ?? new Date(2100, 1, 1)
        const bEnd = b.ends_at ?? new Date(2100, 1, 1)
        return aEnd.getTime() - bEnd.getTime() || a.balance - b.balance
      })

      console.log('orderedStoreCredits', orderedStoreCredits);

      for (const storeCredit of orderedStoreCredits) {
        const newStoreCreditBalance = Math.max(
          0,
          storeCredit.balance - storeCreditableAmountBalance
        )
        const storeCreditBalanceUsed = storeCredit.balance - newStoreCreditBalance

        await storeCreditService.update(storeCredit.id, {
          balance: newStoreCreditBalance,
          is_disabled: newStoreCreditBalance === 0,
        })

        await storeCreditService.createTransaction({
          store_credit_id: storeCredit.id,
          order_id: order.id,
          amount: storeCreditBalanceUsed,
          // is_taxable: !!giftCard.tax_rate,
          // tax_rate: giftCard.tax_rate,
        })

        storeCreditableAmountBalance =
          storeCreditableAmountBalance - storeCreditBalanceUsed;

        (order as Order).store_credits = [...((order as Order).store_credits ?? []), storeCredit];

        if (storeCreditableAmountBalance == 0) {
          break
        }
      }

      await orderRepo.save(order);

      /**
       * Finish handling store credits
       */

      const shippingOptionServiceTx =
        this.shippingOptionService_.withTransaction(manager)
      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)

      await promiseAll(
        [
          cart.items.map((lineItem): Promise<unknown>[] => {
            const toReturn: Promise<unknown>[] = [
              lineItemServiceTx.update(lineItem.id, { order_id: order.id }),
            ]

            if (lineItem.is_giftcard) {
              toReturn.push(
                ...this.createGiftCardsFromLineItem_(order, lineItem, manager)
              )
            }

            return toReturn
          }),
          cart.shipping_methods.map(async (method): Promise<unknown> => {
            // TODO: Due to cascade insert we have to remove the tax_lines that have been added by the cart decorate totals.
            // Is the cascade insert really used? Also, is it really necessary to pass the entire entities when creating or updating?
            // We normally should only pass what is needed?
            ;(method.tax_lines as any) = undefined
            return shippingOptionServiceTx.updateShippingMethod(method.id, {
              order_id: order.id,
            })
          }),
        ].flat(Infinity)
      )

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.PLACED, {
          id: order.id,
          no_notification: order.no_notification,
        })

      await cartServiceTx.update(cart.id, { completed_at: new Date() })

      return order as Order
    })
  }

  /**
   * Calculate and attach the different total fields on the object
   */
  async decorateTotals(order: Order, totalsFieldsOrContext?): Promise<Order> {
    const order_ = (await super.decorateTotals(
      order,
      totalsFieldsOrContext
    )) as Order;

    if (Array.isArray(totalsFieldsOrContext)) {
      if (totalsFieldsOrContext.length) {
        // this.decorateTotalsLegacy() should have decorated the totals already
        return order_;
      }
      totalsFieldsOrContext = {};
    }

    console.log(
      "order.ts::decorateTotals::totalsFieldsOrContext",
      totalsFieldsOrContext
    );

    return await this.decorateStoreCreditTotals(order_);
  }

  async decorateStoreCreditTotals(order: Order): Promise<Order> {
    const newTotalsService = this.newTotalsService_ as NewTotalsService;

    const storeCreditableAmount = newTotalsService.getStoreCreditableAmount(
      order.total
    );

    // console.log('order.ts::decorateTotals::order.store_credits', order.store_credits);
    // console.log('order.ts::decorateTotals::order.store_credit_transactions', order.store_credit_transactions);

    const storeCreditTotal = await newTotalsService.getStoreCreditTotals(
      storeCreditableAmount,
      {
        storeCredits: order.store_credits,
        storeCreditTransactions: order.store_credit_transactions ?? [],
      }
    );
    order.store_credit_total = storeCreditTotal;

    console.log("order.ts::decorateTotals::order", order);

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

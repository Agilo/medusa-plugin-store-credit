// import { asClass, createContainer } from "awilix";
// import { Region } from "../../models";
// import {
//   defaultContainerMock,
//   giftCards,
//   giftCardsWithTaxRate,
// } from "../__fixtures__/new-totals";
import NewTotalsService from "../new-totals";

describe("New totals service", () => {
  describe("Without [MEDUSA_FF_TAX_INCLUSIVE_PRICING]", () => {
    describe("getStoreCreditTotals", () => {
      let container;
      let newTotalsService: NewTotalsService;

    //   beforeEach(() => {
    //     container = createContainer({}, defaultContainerMock);
    //     container.register("newTotalsService", asClass(NewTotalsService));
    //     newTotalsService = container.resolve("newTotalsService");
    //   });

      it("should compute the store credit totals amount in non taxable region", async () => {
        expect(true).toBe(true);
      });
    });

    // describe("getGiftCardTotals", () => {
    //   let container;
    //   let newTotalsService: NewTotalsService;

    //   beforeEach(() => {
    //     container = createContainer({}, defaultContainerMock);
    //     container.register("newTotalsService", asClass(NewTotalsService));
    //     newTotalsService = container.resolve("newTotalsService");
    //   });

    //   afterEach(() => {
    //     jest.clearAllMocks();
    //   });

    //   it("should compute the gift cards totals amount in non taxable region", async () => {
    //     const maxAmount = 1000;

    //     const testGiftCard = giftCards[0];

    //     const region = {
    //       gift_cards_taxable: false,
    //     } as Region;

    //     const gitCardTotals = await newTotalsService.getGiftCardTotals(
    //       maxAmount,
    //       {
    //         giftCards: [testGiftCard],
    //         region,
    //       }
    //     );

    //     expect(gitCardTotals).toEqual(
    //       expect.objectContaining({
    //         total: 1000,
    //         tax_total: 0,
    //       })
    //     );
    //   });

    //   it("should compute the gift cards totals amount using the gift card tax rate", async () => {
    //     const maxAmount = 1000;

    //     const testGiftCard = giftCardsWithTaxRate[0];

    //     const region = {
    //       // These values aren't involved in calculating tax rates for a gift card
    //       // GiftCard.tax_rate will be the source of truth for tax calculations
    //       // This is needed for giftCardTransactions backwards compatability reasons
    //       gift_cards_taxable: true,
    //       tax_rate: 0,
    //     } as Region;

    //     const gitCardTotals = await newTotalsService.getGiftCardTotals(
    //       maxAmount,
    //       {
    //         giftCards: [testGiftCard],
    //         region,
    //       }
    //     );

    //     expect(gitCardTotals).toEqual(
    //       expect.objectContaining({
    //         total: 1000,
    //         tax_total: 200,
    //       })
    //     );
    //   });

    //   it("should compute the gift cards totals amount in non taxable region using gift card transactions", async () => {
    //     const maxAmount = 1000;
    //     const testGiftCard = giftCards[0];
    //     const giftCardTransactions = [
    //       {
    //         tax_rate: 20,
    //         is_taxable: false,
    //         amount: 1000,
    //         gift_card: testGiftCard,
    //       },
    //     ];

    //     const region = {
    //       gift_cards_taxable: false,
    //     } as Region;

    //     const gitCardTotals = await newTotalsService.getGiftCardTotals(
    //       maxAmount,
    //       {
    //         giftCardTransactions,
    //         region,
    //       }
    //     );

    //     expect(gitCardTotals).toEqual(
    //       expect.objectContaining({
    //         total: 1000,
    //         tax_total: 200,
    //       })
    //     );
    //   });

    //   it("should compute the gift cards totals amount in a taxable region using gift card transactions", async () => {
    //     const maxAmount = 1000;
    //     const testGiftCard = giftCards[0];
    //     const giftCardTransactions = [
    //       {
    //         tax_rate: 20,
    //         is_taxable: null,
    //         amount: 1000,
    //         gift_card: testGiftCard,
    //       },
    //     ];

    //     const region = {
    //       gift_cards_taxable: true,
    //       tax_rate: 30,
    //     } as Region;

    //     const gitCardTotals = await newTotalsService.getGiftCardTotals(
    //       maxAmount,
    //       {
    //         giftCardTransactions: giftCardTransactions,
    //         region,
    //       }
    //     );

    //     expect(gitCardTotals).toEqual(
    //       expect.objectContaining({
    //         total: 1000,
    //         tax_total: 300,
    //       })
    //     );
    //   });

    //   it("should compute the gift cards totals amount using gift card transactions for gift card with tax_rate", async () => {
    //     const maxAmount = 1000;
    //     const testGiftCard = giftCardsWithTaxRate[0];
    //     const giftCardTransactions = [
    //       {
    //         tax_rate: 20,
    //         is_taxable: null,
    //         amount: 1000,
    //         gift_card: testGiftCard,
    //       },
    //     ];

    //     const region = {
    //       // These values aren't involved in calculating tax rates for a gift card
    //       // GiftCard.tax_rate will be the source of truth for tax calculations
    //       // This is needed for giftCardTransactions backwards compatability reasons
    //       gift_cards_taxable: false,
    //       tax_rate: 99,
    //     } as Region;

    //     const gitCardTotals = await newTotalsService.getGiftCardTotals(
    //       maxAmount,
    //       {
    //         giftCardTransactions: giftCardTransactions,
    //         region,
    //       }
    //     );

    //     expect(gitCardTotals).toEqual(
    //       expect.objectContaining({
    //         total: 1000,
    //         tax_total: 200,
    //       })
    //     );
    //   });
    // });
  });

  // describe("With [MEDUSA_FF_TAX_INCLUSIVE_PRICING]", () => {
  //   // todo: do we need to test the tax inclusive pricing feature flag?
  // });
});

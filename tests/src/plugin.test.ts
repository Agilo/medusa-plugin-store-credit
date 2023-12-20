import { beforeAll, expect, test } from "vitest";
import config from "./config";
import { getEphemeralCartProps, recursiveStripProps } from "./utils";

/**
 * todo:
 *   - test admin dashboard orders list (decorateTotalsLegacy)
 *   - test order detail
 */

let regions: any[];
let products: any[];

beforeAll(async () => {
  let response = await fetch(`${config.apiUrl}/store/regions?limit=99999`);
  let data = await response.json();
  regions = data.regions;

  response = await fetch(`${config.apiUrl}/store/products?limit=99999`);
  data = await response.json();
  products = data.products;
});

test("Guest cart should have zero store_credit_total", async () => {
  /**
   * store_credit_total should be 0 in an empty guest cart
   */
  const response = await fetch(`${config.apiUrl}/store/carts`, {
    method: "POST",
  });
  const data = await response.json();

  recursiveStripProps(data, [...getEphemeralCartProps()]);

  expect({ data, status: response.status }).toMatchFileSnapshot(
    `${__dirname}/fixtures/store/guest-cart.json`
  );
});

import { beforeAll, describe, expect, test } from "vitest";
import config from "./config";
import {
  getEphemeralCartProps,
  getProductById,
  getRegionByIso2,
  recursiveStripProps,
} from "./utils";

const cookies: Record<"jane@agilo.co", string[]> = {
  "jane@agilo.co": [],
};

const customers: Record<"jane@agilo.co", any> = {
  "jane@agilo.co": {
    billing_address: {
      address_1: "Mosećka ul. bb",
      address_2: "",
      city: "Split",
      country_code: "hr",
      first_name: "John",
      last_name: "Doe",
      phone: "",
      postal_code: "21000",
      province: "",
      company: "Agilo",
    },
    shipping_address: {
      address_1: "Mosećka ul. bb",
      address_2: "",
      city: "Split",
      country_code: "hr",
      first_name: "John",
      last_name: "Doe",
      phone: "",
      postal_code: "21000",
      province: "",
      company: "Agilo",
    },
  },
};

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

describe("Customer login flow (jane@agilo.co)", () => {
  /**
   * Jane has no store credits.
   */

  test("Zero store_credit balance should be returned on auth (jane@agilo.co)", async () => {
    const response = await fetch(`${config.apiUrl}/store/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "jane@agilo.co", password: "supersecret" }),
    });
    const data = await response.json();

    cookies["jane@agilo.co"] = response.headers.getSetCookie();

    recursiveStripProps(data, [
      "data.customer.created_at",
      "data.customer.shipping_addresses.created_at",
      "data.customer.shipping_addresses.id",
      "data.customer.shipping_addresses.updated_at",
      "data.customer.store_credit.region_id",
      "data.customer.updated_at",
    ]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/customer-jane-01.json`
    );
  });

  test("Zero store_credit balance should be returned for authenticated customer (jane@agilo.co)", async () => {
    const response = await fetch(`${config.apiUrl}/store/customers/me`, {
      headers: {
        Cookie: cookies["jane@agilo.co"].join(";"),
      },
    });
    const data = await response.json();

    recursiveStripProps(data, [
      "data.customer.created_at",
      "data.customer.shipping_addresses.created_at",
      "data.customer.shipping_addresses.id",
      "data.customer.shipping_addresses.updated_at",
      "data.customer.store_credit.region_id",
      "data.customer.updated_at",
    ]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/customer-jane-02.json`
    );
  });
});

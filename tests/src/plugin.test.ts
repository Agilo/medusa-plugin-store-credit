import { beforeAll, describe, expect, test } from "vitest";
import config from "./config";
import {
  getEphemeralCartProps,
  getProductById,
  getRegionByIso2,
  recursiveStripProps,
} from "./utils";

const cookies: Record<"john@agilo.co" | "jane@agilo.co", string[]> = {
  "john@agilo.co": [],
  "jane@agilo.co": [],
};

const customers: Record<"john@agilo.co" | "jane@agilo.co", any> = {
  "john@agilo.co": {
    billing_address: {
      address_1: "Tannenring 76",
      address_2: "",
      city: "Wiesbaden",
      country_code: "de",
      first_name: "John",
      last_name: "Doe",
      phone: "06127 4871",
      postal_code: "65207",
      province: "Hesse",
      company: "Agilo",
    },
    shipping_address: {
      address_1: "Tannenring 76",
      address_2: "",
      city: "Wiesbaden",
      country_code: "de",
      first_name: "John",
      last_name: "Doe",
      phone: "06127 4871",
      postal_code: "65207",
      province: "Hesse",
      company: "Agilo",
    },
  },
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

describe("Customer login flow 01 (john@agilo.co)", () => {
  test("Proper store_credit balance should be returned on auth (john@agilo.co)", async () => {
    const response = await fetch(`${config.apiUrl}/store/auth`, {
      // credentials: "include", // doesn't work
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "john@agilo.co", password: "supersecret" }),
    });
    const data = await response.json();

    cookies["john@agilo.co"] = response.headers.getSetCookie();

    recursiveStripProps(data, [
      "data.customer.created_at",
      "data.customer.shipping_addresses.created_at",
      "data.customer.shipping_addresses.id",
      "data.customer.shipping_addresses.updated_at",
      "data.customer.store_credit.region_id",
      "data.customer.updated_at",
    ]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-login-flow-01-customer-01.json`
    );
  });

  test("Proper store_credit balance should be returned for authenticated customer (john@agilo.co)", async () => {
    const response = await fetch(`${config.apiUrl}/store/customers/me`, {
      // credentials: "include", // doesn't work
      headers: {
        Cookie: cookies["john@agilo.co"].join(";"),
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
      `${__dirname}/fixtures/store/john-login-flow-01-customer-02.json`
    );
  });
});

describe("Customer purchase flow 01 (john@agilo.co)", () => {
  let cartId: string;

  test("Create cart (john@agilo.co)", async () => {
    const response = await fetch(`${config.apiUrl}/store/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies["john@agilo.co"].join(";"),
      },
      body: JSON.stringify({ region_id: getRegionByIso2(regions, "de").id }),
    });
    const data = await response.json();

    cartId = data.cart.id;

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-purchase-flow-01-cart-01.json`
    );
  });

  test("Add product to cart (john@agilo.co)", async () => {
    /**
     * add prod_medusacoffeemug to cart
     * this should use some of the store credits but not all
     */

    const product = getProductById(products, "prod_medusacoffeemug");

    const response = await fetch(
      `${config.apiUrl}/store/carts/${cartId}/line-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies["john@agilo.co"].join(";"),
        },
        body: JSON.stringify({
          variant_id: product.variants[0].id,
          quantity: 2,
        }),
      }
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-purchase-flow-01-cart-02.json`
    );
  });

  test("Set billing and shipping addresses (john@agilo.co)", async () => {
    const response = await fetch(`${config.apiUrl}/store/carts/${cartId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies["john@agilo.co"].join(";"),
      },
      body: JSON.stringify({
        email: "john@agilo.co",
        billing_address: customers["john@agilo.co"].billing_address,
        shipping_address: customers["john@agilo.co"].shipping_address,
      }),
    });
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-purchase-flow-01-cart-03.json`
    );
  });

  test("Set shipping (john@agilo.co)", async () => {
    let response = await fetch(
      `${config.apiUrl}/store/shipping-options/${cartId}`,
      {
        headers: {
          Cookie: cookies["john@agilo.co"].join(";"),
        },
      }
    );
    const { shipping_options } = await response.json();

    response = await fetch(
      `${config.apiUrl}/store/carts/${cartId}/shipping-methods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies["john@agilo.co"].join(";"),
        },
        body: JSON.stringify({
          option_id: shipping_options[0].id,
        }),
      }
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-purchase-flow-01-cart-04.json`
    );
  });

  test.skipIf(process.env.MEDUSA_PLUGIN_STORE_CREDIT_TEST === "partial")(
    "Complete checkout (john@agilo.co)",
    async () => {
      const response = await fetch(
        `${config.apiUrl}/store/carts/${cartId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies["john@agilo.co"].join(";"),
          },
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();

      // todo: strip ephemeral order props

      expect({ data, status: response.status }).toMatchFileSnapshot(
        `${__dirname}/fixtures/store/john-purchase-flow-01-order-01.json`
      );
    }
  );
});

describe("Customer purchase flow 02 (john@agilo.co)", () => {
  let cartId: string;

  test("Create cart (john@agilo.co)", async () => {
    const response = await fetch(`${config.apiUrl}/store/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies["john@agilo.co"].join(";"),
      },
      body: JSON.stringify({ region_id: getRegionByIso2(regions, "de").id }),
    });
    const data = await response.json();

    cartId = data.cart.id;

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-purchase-flow-02-cart-01.json`
    );
  });

  test("Add first product to cart (john@agilo.co)", async () => {
    /**
     * add prod_medusasweatpants to cart
     * this should use some of the store credits but not all
     */

    const product = getProductById(products, "prod_medusasweatpants");

    const response = await fetch(
      `${config.apiUrl}/store/carts/${cartId}/line-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies["john@agilo.co"].join(";"),
        },
        body: JSON.stringify({
          variant_id: product.variants[0].id,
          quantity: 1,
        }),
      }
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-purchase-flow-02-cart-02.json`
    );
  });

  test("Add second product to cart (john@agilo.co)", async () => {
    /**
     * add prod_themostexpensivetshirt to cart
     * this should use up all remaining store credits
     */

    const product = getProductById(products, "prod_themostexpensivetshirt");

    const response = await fetch(
      `${config.apiUrl}/store/carts/${cartId}/line-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies["john@agilo.co"].join(";"),
        },
        body: JSON.stringify({
          variant_id: product.variants[0].id,
          quantity: 1,
        }),
      }
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/store/john-purchase-flow-02-cart-03.json`
    );
  });
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

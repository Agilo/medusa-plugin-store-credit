import { beforeAll, describe, expect, test } from "vitest";
import config from "./config";
import {
  getEphemeralCartProps,
  getEphemeralCustomerProps,
  getEphemeralOrderProps,
  getProductById,
  getRegionByIso2,
  recursiveStripProps,
} from "./utils";
import randomize from "randomatic";

const customer = {
  id: "",
  email: "",
  first_name: "John",
  last_name: "Doe",
  phone: "555-555-5555",
  password: "supersecret",
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
  store_credits: [
    {
      value: 1000,
      balance: 1000,
      country: "de",
      is_disabled: false,
      ends_at: null,
      description: "10 euro store credit",
    },
    {
      value: 10000,
      balance: 10000,
      country: "de",
      is_disabled: false,
      ends_at: null,
      description: "100 euro store credit",
    },
    {
      value: 100000,
      balance: 100000,
      country: "de",
      is_disabled: false,
      ends_at: null,
      description: "",
    },
    {
      value: 1000,
      balance: 1000,
      country: "de",
      is_disabled: true,
      ends_at: null,
      description: "",
    },
    {
      value: 1000,
      balance: 1000,
      country: "de",
      is_disabled: false,
      ends_at: "2020-01-01 14:35:59.752685+00",
      description: "",
    },
    // {
    //   value: 1000,
    //   balance: 0,
    //   country: "de",
    //   is_disabled: false,
    //   ends_at: null,
    //   description: "",
    // },
    {
      value: 1000,
      balance: 1000,
      country: "us",
      is_disabled: false,
      ends_at: null,
      description: "",
    },
    {
      value: 89999,
      balance: 89999,
      country: "us",
      is_disabled: false,
      ends_at: null,
      description: "",
    },
  ],
};

let cookies: string[];
let regions: any[];
let products: any[];

beforeAll(async () => {
  let response = await fetch(`${config.apiUrl}/store/regions?limit=99999`);
  let data = await response.json();
  regions = data.regions;

  response = await fetch(`${config.apiUrl}/store/products?limit=99999`);
  data = await response.json();
  products = data.products;

  customer.email = `john-${randomize("a0", 5)}@example.com`;
});

describe.sequential("Customer flow (john)", () => {
  test("Create customer (john)", async () => {
    const response = await fetch(`${config.apiUrl}/store/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        password: customer.password,
      }),
    });
    const data = await response.json();

    customer.id = data.customer.id;

    recursiveStripProps(data, [...getEphemeralCustomerProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/create-customer.json`,
    );
  });

  test("Create store credit (john)", async () => {
    await Promise.all(
      customer.store_credits.map(async (storeCredit, index) => {
        const response = await fetch(`${config.apiUrl}/admin/store-credits`, {
          method: "POST",
          headers: {
            "x-medusa-access-token": config.apiToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: storeCredit.value,
            ends_at: storeCredit.ends_at,
            is_disabled: storeCredit.is_disabled,
            region_id: getRegionByIso2(regions, storeCredit.country).id,
            customer_id: customer.id,
            description: storeCredit.description,
          }),
        });
        const data = await response.json();

        recursiveStripProps(data, [
          "data.storeCredit.created_at",
          "data.storeCredit.customer_id",
          "data.storeCredit.id",
          "data.storeCredit.region_id",
          "data.storeCredit.updated_at",
        ]);

        expect({ data, status: response.status }).toMatchFileSnapshot(
          `${__dirname}/fixtures/customer-john/store-credit-${index + 1}.json`,
        );
      }),
    );
  });

  // todo: create store credit for customer

  test("Proper store_credit balance should be returned on auth (john)", async () => {
    const response = await fetch(`${config.apiUrl}/store/auth`, {
      // credentials: "include", // doesn't work
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customer.email,
        password: customer.password,
      }),
    });
    const data = await response.json();

    cookies = response.headers.getSetCookie();

    recursiveStripProps(data, [...getEphemeralCustomerProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-login-flow-01-customer-01.json`,
    );
  });

  test("Proper store_credit balance should be returned for authenticated customer (john)", async () => {
    const response = await fetch(`${config.apiUrl}/store/customers/me`, {
      // credentials: "include", // doesn't work
      headers: {
        Cookie: cookies.join(";"),
      },
    });
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCustomerProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-login-flow-01-customer-02.json`,
    );
  });

  let cartId: string;

  test("Create cart (john)", async () => {
    const response = await fetch(`${config.apiUrl}/store/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies.join(";"),
      },
      body: JSON.stringify({ region_id: getRegionByIso2(regions, "de").id }),
    });
    const data = await response.json();

    cartId = data.cart.id;

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-01-cart-01.json`,
    );
  });

  test("Add product to cart (john)", async () => {
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
          Cookie: cookies.join(";"),
        },
        body: JSON.stringify({
          variant_id: product.variants[0].id,
          quantity: 2,
        }),
      },
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-01-cart-02.json`,
    );
  });

  test("Set billing and shipping addresses (john)", async () => {
    const response = await fetch(`${config.apiUrl}/store/carts/${cartId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies.join(";"),
      },
      body: JSON.stringify({
        email: customer.email,
        billing_address: customer.billing_address,
        shipping_address: customer.shipping_address,
      }),
    });
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-01-cart-03.json`,
    );
  });

  test("Set shipping (john)", async () => {
    let response = await fetch(
      `${config.apiUrl}/store/shipping-options/${cartId}`,
      {
        headers: {
          Cookie: cookies.join(";"),
        },
      },
    );
    const { shipping_options } = await response.json();

    response = await fetch(
      `${config.apiUrl}/store/carts/${cartId}/shipping-methods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies.join(";"),
        },
        body: JSON.stringify({
          option_id: shipping_options[0].id,
        }),
      },
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-01-cart-04.json`,
    );
  });

  test("Complete checkout (john)", async () => {
    const response = await fetch(
      `${config.apiUrl}/store/carts/${cartId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies.join(";"),
        },
        body: JSON.stringify({}),
      },
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralOrderProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-01-order-01.json`,
    );
  });

  // let cartId: string;

  test("Create cart (john)", async () => {
    const response = await fetch(`${config.apiUrl}/store/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies.join(";"),
      },
      body: JSON.stringify({ region_id: getRegionByIso2(regions, "de").id }),
    });
    const data = await response.json();

    cartId = data.cart.id;

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-02-cart-01.json`,
    );
  });

  test("Add first product to cart (john)", async () => {
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
          Cookie: cookies.join(";"),
        },
        body: JSON.stringify({
          variant_id: product.variants[0].id,
          quantity: 1,
        }),
      },
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-02-cart-02.json`,
    );
  });

  test("Add second product to cart (john)", async () => {
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
          Cookie: cookies.join(";"),
        },
        body: JSON.stringify({
          variant_id: product.variants[0].id,
          quantity: 1,
        }),
      },
    );
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCartProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-john/john-purchase-flow-02-cart-03.json`,
    );
  });
});

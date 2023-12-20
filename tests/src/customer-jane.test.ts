import randomize from "randomatic";
import { beforeAll, describe, expect, test } from "vitest";
import config from "./config";
import { getEphemeralCustomerProps, recursiveStripProps } from "./utils";

const customer = {
  id: "", // eg. jane-abcde@example.com
  email: "",
  first_name: "Jane",
  last_name: "Doe",
  phone: "555-555-5555",
  password: "supersecret",
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
  store_credits: [],
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

  customer.email = `jane-${randomize("a0", 5)}@example.com`;
});

describe("Customer flow (jane)", () => {
  test("Create customer (jane)", async () => {
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
      `${__dirname}/fixtures/customer-jane/create-customer.json`
    );
  });

  test("Zero store_credit balance should be returned on auth (jane)", async () => {
    const response = await fetch(`${config.apiUrl}/store/auth`, {
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
      `${__dirname}/fixtures/customer-jane/customer-jane-01.json`
    );
  });

  test("Zero store_credit balance should be returned for authenticated customer (jane)", async () => {
    const response = await fetch(`${config.apiUrl}/store/customers/me`, {
      headers: {
        Cookie: cookies.join(";"),
      },
    });
    const data = await response.json();

    recursiveStripProps(data, [...getEphemeralCustomerProps()]);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `${__dirname}/fixtures/customer-jane/customer-jane-02.json`
    );
  });
});

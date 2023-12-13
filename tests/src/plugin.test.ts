import { expect, test } from "vitest";
import config from "./config";
import { recursiveStripProps } from "./utils";

let cookies: string[];

test("Guest cart should have zero store_credit_total", async () => {
  /**
   * store_credit_total should be 0 in an empty guest cart
   */
  const response = await fetch(`${config.apiUrl}/store/carts`, {
    method: "POST",
  });
  const data = await response.json();

  recursiveStripProps(data, [
    "data.cart.created_at",
    "data.cart.id",
    "data.cart.region_id",
    "data.cart.region.countries.region_id",
    "data.cart.region.created_at",
    "data.cart.region.id",
    "data.cart.region.updated_at",
    "data.cart.sales_channel_id",
    "data.cart.sales_channel.created_at",
    "data.cart.sales_channel.id",
    "data.cart.sales_channel.updated_at",
    "data.cart.updated_at",
  ]);

  expect({ data, status: response.status }).toMatchFileSnapshot(
    `../../fixtures/store/carts/create-cart/guest-cart.json`
  );
});

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

  cookies = response.headers.getSetCookie();

  recursiveStripProps(data, [
    "data.customer.created_at",
    "data.customer.shipping_addresses.created_at",
    "data.customer.shipping_addresses.id",
    "data.customer.shipping_addresses.updated_at",
    "data.customer.store_credit.region_id",
    "data.customer.updated_at",
  ]);

  expect({ data, status: response.status }).toMatchFileSnapshot(
    `../../fixtures/store/carts/create-cart/customer-john-01.json`
  );
});

test("Proper store_credit balance should be returned for authenticated customer (john@agilo.co)", async () => {
  const response = await fetch(`${config.apiUrl}/store/customers/me`, {
    // credentials: "include", // doesn't work
    headers: {
      Cookie: cookies.join(";"),
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
    `../../fixtures/store/carts/create-cart/customer-john-02.json`
  );
});

test("Zero store_credit balance should be returned on auth (jane@agilo.co)", async () => {
  const response = await fetch(`${config.apiUrl}/store/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "jane@agilo.co", password: "supersecret" }),
  });
  const data = await response.json();

  cookies = response.headers.getSetCookie();

  recursiveStripProps(data, [
    "data.customer.created_at",
    "data.customer.shipping_addresses.created_at",
    "data.customer.shipping_addresses.id",
    "data.customer.shipping_addresses.updated_at",
    "data.customer.store_credit.region_id",
    "data.customer.updated_at",
  ]);

  expect({ data, status: response.status }).toMatchFileSnapshot(
    `../../fixtures/store/carts/create-cart/customer-jane-01.json`
  );
});

test("Zero store_credit balance should be returned for authenticated customer (jane@agilo.co)", async () => {
  const response = await fetch(`${config.apiUrl}/store/customers/me`, {
    headers: {
      Cookie: cookies.join(";"),
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
    `../../fixtures/store/carts/create-cart/customer-jane-02.json`
  );
});
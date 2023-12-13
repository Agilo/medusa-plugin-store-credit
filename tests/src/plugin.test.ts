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
    `fixtures/store/guest-cart.json`
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
    `fixtures/store/customer-john-01.json`
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
    `fixtures/store/customer-john-02.json`
  );
});

test("should utilize store credits", async () => {
  // create cart

  let response = await fetch(`${config.apiUrl}/store/carts`, {
    method: "POST",
  });
  let data = await response.json();

  const cartId = data.cart.id;

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
    `fixtures/store/john-cart-01.json`
  );

  /**
   * add prod_medusasweatpants to cart
   * this should use some of the store credits but not all
   */

  response = await fetch(
    `${config.apiUrl}/store/products/prod_medusasweatpants`
  );
  let { product } = await response.json();

  response = await fetch(`${config.apiUrl}/store/carts/${cartId}/line-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variant_id: product.variants[0].id,
      quantity: 1,
    }),
  });
  data = await response.json();

  recursiveStripProps(data, [
    "data.cart.created_at",
    "data.cart.id",
    "data.cart.items.cart_id",
    "data.cart.items.created_at",
    "data.cart.items.id",
    "data.cart.items.tax_lines.item_id",
    "data.cart.items.updated_at",
    "data.cart.items.variant_id",
    "data.cart.items.variant.created_at",
    "data.cart.items.variant.id",
    "data.cart.items.variant.product.created_at",
    "data.cart.items.variant.product.profile_id",
    "data.cart.items.variant.product.profile.created_at",
    "data.cart.items.variant.product.profile.id",
    "data.cart.items.variant.product.profile.updated_at",
    "data.cart.items.variant.product.profiles.created_at",
    "data.cart.items.variant.product.profiles.id",
    "data.cart.items.variant.product.profiles.updated_at",
    "data.cart.items.variant.product.updated_at",
    "data.cart.items.variant.updated_at",
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
    `fixtures/store/john-cart-02.json`
  );

  /**
   * add prod_themostexpensivetshirt to cart
   * this should use up all remaining store credits
   */

  response = await fetch(
    `${config.apiUrl}/store/products/prod_themostexpensivetshirt`
  );
  ({ product } = await response.json());

  response = await fetch(`${config.apiUrl}/store/carts/${cartId}/line-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variant_id: product.variants[0].id,
      quantity: 1,
    }),
  });
  data = await response.json();

  recursiveStripProps(data, [
    "data.cart.created_at",
    "data.cart.id",
    "data.cart.items.cart_id",
    "data.cart.items.created_at",
    "data.cart.items.id",
    "data.cart.items.tax_lines.item_id",
    "data.cart.items.updated_at",
    "data.cart.items.variant_id",
    "data.cart.items.variant.created_at",
    "data.cart.items.variant.id",
    "data.cart.items.variant.product.created_at",
    "data.cart.items.variant.product.profile_id",
    "data.cart.items.variant.product.profile.created_at",
    "data.cart.items.variant.product.profile.id",
    "data.cart.items.variant.product.profile.updated_at",
    "data.cart.items.variant.product.profiles.created_at",
    "data.cart.items.variant.product.profiles.id",
    "data.cart.items.variant.product.profiles.updated_at",
    "data.cart.items.variant.product.updated_at",
    "data.cart.items.variant.updated_at",
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
    `fixtures/store/john-cart-03.json`
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
    `fixtures/store/customer-jane-01.json`
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
    `fixtures/store/customer-jane-02.json`
  );
});

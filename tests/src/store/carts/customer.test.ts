import { describe, expect, it } from "vitest";
import config from "../../config";
import { recursiveStripProps } from "../../utils";

describe("Foo bar 2", () => {
  let cookies: string[];

  it("should authenticate and return proper store_credit balances", async () => {
    const response = await fetch(`${config.apiUrl}/store/auth`, {
      // credentials: "include",
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

  it("should return proper store_credit balances for authenticated customer", async () => {
    // console.log(cookies);

    const response = await fetch(`${config.apiUrl}/store/customers/me`, {
      // credentials: "include",
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

  it("should authenticate and return zero store_credit balances", async () => {
    const response = await fetch(`${config.apiUrl}/store/auth`, {
      // credentials: "include",
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

  it("should return zero store_credit balances for authenticated customer", async () => {
    // console.log(cookies);

    const response = await fetch(`${config.apiUrl}/store/customers/me`, {
      // credentials: "include",
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
});

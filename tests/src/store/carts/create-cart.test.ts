import { isObject } from "lodash";
import { describe, expect, it } from "vitest";
import config from "../../config";
import { recursiveStripProps } from "../../utils";

// function testAndSanitizeData(data: any) {
//   expect(isObject(data)).toBe(true);
//   expect(isObject(data.bundle)).toBe(true);

//   expect(typeof data.bundle.created_at).toBe("string");
//   expect(typeof data.bundle.updated_at).toBe("string");

//   recursiveStripProps(data, [
//     "data.bundle.created_at",
//     "data.bundle.updated_at",
//   ]);
// }

describe("Foo bar", () => {
  it("should have zero store_credit_total in guest cart", async () => {
    /**
     * store_credit_total should be 0 in an empty cart
     */
    const response = await fetch(`${config.apiUrl}/store/carts`, {
      method: "POST",
    });
    const data = await response.json();

    expect(isObject(data)).toBe(true);
    expect(isObject(data.cart)).toBe(true);

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

  // it("should utilize store credits", async () => {
  //   const id = "bundle_coffeemugs01";
  //   let response = await fetch(`${config.apiUrl}/store/carts`, {
  //     method: "POST",
  //   });
  //   let { cart } = await response.json();

  //   response = await fetch(
  //     `${config.apiUrl}/store/products/prod_themostexpensivetshirt`
  //   );
  //   const { product } = await response.json();

  //   response = await fetch(
  //     `${config.apiUrl}/store/carts/${cart.id}/line-items`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify({
  //         variant_id: product.variants[0].id,
  //         quantity: 1,
  //       }),
  //     }
  //   );
  //   ({ cart } = await response.json());

  //   expect({ data, status: response.status }).toMatchFileSnapshot(
  //     `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
  //   );
  // });

  // it("should return a 404 not found response because bundle does not exist", async () => {
  //   const id = "bundle_dummy";
  //   const response = await fetch(`${config.apiUrl}/store/bundles/${id}`);
  //   const data = await response.json();

  //   expect({ data, status: response.status }).toMatchFileSnapshot(
  //     `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
  //   );
  // });

  // it("should return a 404 not found response because bundle is not published", async () => {
  //   const id = "bundle_coffeemugs11";
  //   const response = await fetch(`${config.apiUrl}/store/bundles/${id}`);
  //   const data = await response.json();

  //   expect({ data, status: response.status }).toMatchFileSnapshot(
  //     `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
  //   );
  // });
});

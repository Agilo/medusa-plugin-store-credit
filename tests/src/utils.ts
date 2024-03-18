import { isArray, isObject } from "lodash";

/**
 * Recursively strip object properties, useful for timestamps, IDs, nested IDs, etc.
 */
export function recursiveStripProps(
  data: any,
  props: string[],
  path: string[] = ["data"],
) {
  // console.log(path.join("."));
  if (isArray(data)) {
    data.map((value) => recursiveStripProps(value, props, path));
  } else if (isObject(data)) {
    Object.entries(data).map(([key, value]) => {
      if (props.includes([...path, key].join("."))) {
        // console.log(`stripping ${[...path, key].join(".")}`);
        // @ts-ignore
        // delete data[key];
        // @ts-ignore
        data[key] = "--stripped--";
      } else {
        recursiveStripProps(value, props, [...path, key]);
      }
    });
  } else {
    // noop
  }
}

export function getEphemeralCartProps(prefix: string = "data.cart"): string[] {
  return [
    `${prefix}.billing_address_id`,
    `${prefix}.billing_address.created_at`,
    `${prefix}.billing_address.id`,
    `${prefix}.billing_address.updated_at`,
    `${prefix}.context.user_agent`,
    `${prefix}.created_at`,
    `${prefix}.customer_id`,
    `${prefix}.customer.created_at`,
    `${prefix}.customer.email`,
    `${prefix}.customer.id`,
    `${prefix}.customer.updated_at`,
    `${prefix}.email`,
    `${prefix}.id`,
    `${prefix}.items.cart_id`,
    `${prefix}.items.created_at`,
    `${prefix}.items.id`,
    `${prefix}.items.tax_lines.item_id`,
    `${prefix}.items.updated_at`,
    `${prefix}.items.variant_id`,
    `${prefix}.items.variant.created_at`,
    `${prefix}.items.variant.id`,
    `${prefix}.items.variant.inventory_quantity`,
    `${prefix}.items.variant.product.created_at`,
    `${prefix}.items.variant.product.profile_id`,
    `${prefix}.items.variant.product.profile.created_at`,
    `${prefix}.items.variant.product.profile.id`,
    `${prefix}.items.variant.product.profile.updated_at`,
    `${prefix}.items.variant.product.profiles.created_at`,
    `${prefix}.items.variant.product.profiles.id`,
    `${prefix}.items.variant.product.profiles.updated_at`,
    `${prefix}.items.variant.product.updated_at`,
    `${prefix}.items.variant.updated_at`,
    `${prefix}.region_id`,
    `${prefix}.region.countries.region_id`,
    `${prefix}.region.created_at`,
    `${prefix}.region.id`,
    `${prefix}.region.updated_at`,
    `${prefix}.sales_channel_id`,
    `${prefix}.sales_channel.created_at`,
    `${prefix}.sales_channel.id`,
    `${prefix}.sales_channel.updated_at`,
    `${prefix}.shipping_address_id`,
    `${prefix}.shipping_address.created_at`,
    `${prefix}.shipping_address.id`,
    `${prefix}.shipping_address.updated_at`,
    `${prefix}.shipping_methods.cart_id`,
    `${prefix}.shipping_methods.id`,
    `${prefix}.shipping_methods.shipping_option_id`,
    `${prefix}.shipping_methods.shipping_option.created_at`,
    `${prefix}.shipping_methods.shipping_option.id`,
    `${prefix}.shipping_methods.shipping_option.profile_id`,
    `${prefix}.shipping_methods.shipping_option.region_id`,
    `${prefix}.shipping_methods.shipping_option.updated_at`,
    `${prefix}.shipping_methods.tax_lines.shipping_method_id`,
    `${prefix}.updated_at`,
  ];
}

export function getEphemeralCustomerProps(
  prefix: string = "data.customer",
): string[] {
  return [
    `${prefix}.created_at`,
    `${prefix}.email`,
    `${prefix}.id`,
    `${prefix}.shipping_addresses.created_at`,
    `${prefix}.shipping_addresses.id`,
    `${prefix}.shipping_addresses.updated_at`,
    `${prefix}.store_credits.region_id`,
    `${prefix}.updated_at`,
  ];
}

export function getEphemeralOrderProps(prefix: string = "data.data"): string[] {
  return [
    `${prefix}.billing_address_id`,
    `${prefix}.cart_id`,
    `${prefix}.created_at`,
    `${prefix}.customer_id`,
    `${prefix}.display_id`,
    `${prefix}.email`,
    `${prefix}.id`,
    `${prefix}.items.cart_id`,
    `${prefix}.items.created_at`,
    `${prefix}.items.id`,
    `${prefix}.items.order_id`,
    `${prefix}.items.tax_lines.created_at`,
    `${prefix}.items.tax_lines.id`,
    `${prefix}.items.tax_lines.item_id`,
    `${prefix}.items.tax_lines.updated_at`,
    `${prefix}.items.updated_at`,
    `${prefix}.items.variant_id`,
    `${prefix}.items.variant.created_at`,
    `${prefix}.items.variant.id`,
    `${prefix}.items.variant.inventory_quantity`,
    `${prefix}.items.variant.updated_at`,
    `${prefix}.region_id`,
    `${prefix}.region.created_at`,
    `${prefix}.region.id`,
    `${prefix}.region.updated_at`,
    `${prefix}.sales_channel_id`,
    `${prefix}.shipping_address_id`,
    `${prefix}.shipping_address.created_at`,
    `${prefix}.shipping_address.id`,
    `${prefix}.shipping_address.updated_at`,
    `${prefix}.shipping_methods.cart_id`,
    `${prefix}.shipping_methods.id`,
    `${prefix}.shipping_methods.order_id`,
    `${prefix}.shipping_methods.shipping_option_id`,
    `${prefix}.shipping_methods.tax_lines.created_at`,
    `${prefix}.shipping_methods.tax_lines.id`,
    `${prefix}.shipping_methods.tax_lines.shipping_method_id`,
    `${prefix}.shipping_methods.tax_lines.updated_at`,
    `${prefix}.store_credit_transactions.created_at`,
    `${prefix}.store_credit_transactions.id`,
    `${prefix}.store_credit_transactions.order_id`,
    `${prefix}.store_credit_transactions.store_credit_id`,
    `${prefix}.store_credits.created_at`,
    `${prefix}.store_credits.customer_id`,
    `${prefix}.store_credits.id`,
    `${prefix}.store_credits.region_id`,
    `${prefix}.store_credits.updated_at`,
    `${prefix}.updated_at`,
  ];
}

export function getRegionByIso2(regions: any[], iso2: string) {
  const region = regions.find((region) => {
    return region.countries.find((country: any) => country.iso_2 === iso2);
  });

  if (!region) {
    throw new Error(`No region found for iso2: ${iso2}`);
  }

  return region;
}

export function getProductById(products: any[], id: string) {
  const product = products.find((product) => {
    return product.id === id;
  });

  if (!product) {
    throw new Error(`No product found for id: ${id}`);
  }

  return product;
}

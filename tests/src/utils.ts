import { isArray, isObject } from "lodash";

/**
 * Recursively strip object properties, useful for timestamps, IDs, nested IDs, etc.
 */
export function recursiveStripProps(
  data: any,
  props: string[],
  path: string[] = ["data"]
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

export function getRegionByIso2(regions: any[], iso2: string) {
  const region = regions.find((region) => {
    return region.countries.find((country: any) => country.iso_2 === iso2);
  });

  if (!region) {
    throw new Error(`No region found for iso2: ${iso2}`);
  }

  return region;
}

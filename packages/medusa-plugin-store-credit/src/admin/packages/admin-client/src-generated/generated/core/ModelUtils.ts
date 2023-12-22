/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Typing utilities from https://github.com/sindresorhus/type-fest
 */

/**
 * private methods for exportable dependencies
*/
// https://github.com/sindresorhus/type-fest/blob/main/source/except.d.ts
type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true ? never : (KeyType extends ExcludeType ? never : KeyType);

// https://github.com/sindresorhus/type-fest/blob/main/source/enforce-optional.d.ts
type RequiredFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
  ? Type[Key] extends undefined
    ? Key
    : never
  : Key;

type OptionalFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
  ? Type[Key] extends undefined
    ? never
    : Key
  : never;

// https://github.com/sindresorhus/type-fest/blob/main/source/merge.d.ts
type SimpleMerge<Destination, Source> = {
  [Key in keyof Destination | keyof Source]: Key extends keyof Source
    ? Source[Key]
    : Key extends keyof Destination
      ? Destination[Key]
      : never;
};

/**
 * optional exportable dependencies
 */
export type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};

export type IsEqual<A, B> =
  (<G>() => G extends A ? 1 : 2) extends
  (<G>() => G extends B ? 1 : 2)
    ? true
    : false;

export type Except<ObjectType, KeysType extends keyof ObjectType> = {
  [KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
};

export type OmitIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? never
    : KeyType]: ObjectType[KeyType];
};

export type PickIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? KeyType
    : never]: ObjectType[KeyType];
};

export type EnforceOptional<ObjectType> = Simplify<{
  [Key in keyof ObjectType as RequiredFilter<ObjectType, Key>]: ObjectType[Key]
} & {
  [Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<ObjectType[Key], undefined>
}>;

/**
 * SetRequired
 */
export type SetRequired<BaseType, Keys extends keyof BaseType> =
  Simplify<
  // Pick just the keys that are optional from the base type.
  Except<BaseType, Keys> &
  // Pick the keys that should be required from the base type and make them required.
  Required<Pick<BaseType, Keys>>
  >;

/**
 * SetNonNullable
 */
export type SetNonNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = {
  [Key in keyof BaseType]: Key extends Keys
    ? NonNullable<BaseType[Key]>
    : BaseType[Key];
};

/**
 * Merge
 */
export type Merge<Destination, Source> = EnforceOptional<
  SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
  & SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;

/**
 * SetRelation
 * Alias combining SetRequire and SetNonNullable.
 */
export type SetRelation<BaseType, Keys extends keyof BaseType> =
  SetRequired<SetNonNullable<BaseType, Keys>, Keys>;

// Some observations and notes

/**
 * Constructor args
 */

type Color = {
  red: number;
  green: number;
  blue: number;
};
class ColorValue implements Color {
  // public constructor args are a shorthand for assigning to class fields
  constructor(public red: number, public green: number, public blue: number) {}
}

/**
 * ECMA private vs. TS private
 */

class Person {
  #name: string;
  private age: number;
  constructor(name: string, age: number) {
    this.#name = name;
    this.age = age;
  }
}
// ECMA private `#name` is not known to inheritance, but TS `private` is
// "Types have separate declarations of a private property 'age'.ts(2415)"
// @ts-expect-error
class Student extends Person {
  #name: string;
  private age: number;
  constructor(name: string, age: number) {
    super(name, age);
    this.#name = name;
    this.age = age;
  }
}

/**
 * Concepts
 */
// The following are equivalent
type F1 = () => number; // function type
type F2 = { (): number }; // callable type

/**
 * Type challenges
 */

// `extends` is like a comparator in the type system, "does the set C equal the set true"
type If<C, T, F> = C extends true ? T : F;

// Treat T as an array and return its length. Note readonly because tuples are readonly arrays (readonly is a subset of array).
type LengthOfTuple<T> = T extends readonly any[] ? T["length"] : never;

// Note we have to coerce to strings
// prettier-ignore
type EndsWith<A extends string, B extends string> =
  A extends `${any}${B}`
    ? true
    : false;

// We can use the same concat values technique for types
type Concat<A extends any[], B extends any[]> = [...A, ...B];

// `infer` allows us to extract a type that we can use
type ReturnOf<F> = F extends { (...args: any): infer RT } ? RT : never;

// Type of splitting S by separator SEP
// prettier-ignore
type Split<S extends string, SEP extends string> =
  // If S is empty
  S extends ""
    ? SEP extends "" ? [] : [""] //  return empty if no SEP else an empty string
    : // else try spliting into head/tail then extract H and T
    S extends `${infer H}${SEP}${infer T}`
      ? [H, ...Split<T, SEP>] // is true - recurse on the tail T
      : string extends S 
          ? string[] // if S is not a literal return string array
          : [S]; // else return S tupple

// prettier-ignore
type IsTuple<T> = T extends readonly any[]
  // A tuple has a fixed length, so adding a value should not not change its length
  ? [...T, any]['length'] extends T['length']
    ? false // is an array
    : true // is a tuple
  : false; // not an array-ish thing

// Recurse at each index until we match
// prettier-ignore
type IndexOf<
  T extends any[], // is an array
  U,
  Acc extends any [] = [] // accumulate tried slots
> = T[0] extends U 
    ? Acc['length'] // if first item matches return accumulator length
    :T extends [infer F, ...infer Rest] // else extract tail and recurse
    ? IndexOf<Rest, U, [...Acc, F]>
    : -1; // didn't find index

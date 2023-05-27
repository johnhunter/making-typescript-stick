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

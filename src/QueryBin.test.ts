import { describe, expect, it } from "vitest";
import { QueryDefinition, QueryBin } from "./QueryBin";

function dividableBy(modulo: number): QueryDefinition<number> {
  return {
    queryAll: (all: number[]): number[] => all.filter((n) => n % modulo === 0),
    onMultipleFound: (all, found) =>
      new Error(
        `Multiple numbers of ${all} are dividable by ${modulo}: ${found}`,
      ),
    onNoneFound: (all) =>
      new Error(
        `Could not find any numbers in ${all} that are dividable by ${modulo}`,
      ),
  };
}

describe("QueryBin", () => {
  it("is initially empty", () => {
    expect(new QueryBin({}).all()).toEqual([]);
  });

  it("can add values", () => {
    const numbers = new QueryBin({});
    numbers.add(1);
    expect(numbers.all()).toEqual([1]);
    numbers.add(2);
    expect(numbers.all()).toEqual([1, 2]);
  });

  it("can bulk add values", () => {
    const numbers = new QueryBin({});
    numbers.addAll([1, 2, 3]);
    expect(numbers.all()).toEqual([1, 2, 3]);
    numbers.addAll([1, 2]);
    expect(numbers.all()).toEqual([1, 2, 3, 1, 2]);
  });

  it("queryAll returns all results matching a query", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.queryAll.dividableBy(3)).toEqual([3, 6, 9]);
  });

  it("queryAll returns an empty array if no results match", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.queryAll.dividableBy(25)).toEqual([]);
  });

  it("'query' throws an error if multiple results match", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(() => bin.query.dividableBy(3)).toThrow(
      "Multiple numbers of 1,2,3,4,5,6,7,8,9,10 are dividable by 3: 3,6,9",
    );
  });

  it("'query' returns null if no results match", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.query.dividableBy(25)).toEqual(null);
  });

  it("'query' returns the found single value", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.query.dividableBy(7)).toEqual(7);
  });

  it("'get' throws an error if multiple results match", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(() => bin.get.dividableBy(3)).toThrow(
      "Multiple numbers of 1,2,3,4,5,6,7,8,9,10 are dividable by 3: 3,6,9",
    );
  });

  it("'get' throws an error if no results match", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(() => bin.get.dividableBy(25)).toThrow(
      "Could not find any numbers in 1,2,3,4,5,6,7,8,9,10 that are dividable by 25",
    );
  });

  it("'get' returns the found single value", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.get.dividableBy(7)).toEqual(7);
  });

  it("'getAll' return multiple results", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.getAll.dividableBy(3)).toEqual([3, 6, 9]);
  });

  it("'getAll' throws an error if no results match", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(() => bin.getAll.dividableBy(25)).toThrow(
      "Could not find any numbers in 1,2,3,4,5,6,7,8,9,10 that are dividable by 25",
    );
  });

  it("'getAll' returns the found single value", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.getAll.dividableBy(7)).toEqual([7]);
  });

  it("'findAll' return multiple results", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(await bin.findAll.dividableBy(3)).toEqual([3, 6, 9]);
  });

  it("'findAll' throws an error if no results match", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await expect(bin.findAll.dividableBy(25)).rejects.toThrow(
      "Could not find any numbers in 1,2,3,4,5,6,7,8,9,10 that are dividable by 25",
    );
  });

  it("'findAll' returns the found single value", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(await bin.findAll.dividableBy(7)).toEqual([7]);
  });

  it("'findAll' return multiple results if they come in later", async () => {
    const bin = new QueryBin({ dividableBy });
    const result = bin.findAll.dividableBy(3);
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(await result).toEqual([3, 6, 9]);
  });

  it("'find' throws an error on multiple results", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await expect(bin.find.dividableBy(3)).rejects.toThrow(
      "Multiple numbers of 1,2,3,4,5,6,7,8,9,10 are dividable by 3: 3,6,9",
    );
  });

  it("'find' throws an error if no results match", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await expect(bin.findAll.dividableBy(25)).rejects.toThrow(
      "Could not find any numbers in 1,2,3,4,5,6,7,8,9,10 that are dividable by 25",
    );
  });

  it("'find' returns the found single value", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(await bin.find.dividableBy(7)).toEqual(7);
  });

  it("'find' return multiple results if they come in later", async () => {
    const bin = new QueryBin({ dividableBy });
    const result = bin.find.dividableBy(7);
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(await result).toEqual(7);
  });
});

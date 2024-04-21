import { describe, expect, it } from "vitest";
import { QueryBin, QueryDefinition } from "./QueryBin";

function dividableBy(modulo: number): QueryDefinition<number> {
  return {
    queryAll: (all: number[]): number[] => all.filter((n) => n % modulo === 0),
    serializeForErrorMessage: (item) => String(item),
    noneFoundMessage: `No number is dividable by ${modulo}.`,
    multipleFoundMessage: `Multiple numbers are dividable by ${modulo}.`,
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
      "Multiple numbers are dividable by 3.\n" +
        "Found: \n" +
        "3\n" +
        "6\n" +
        "9",
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
      "Multiple numbers are dividable by 3.\n" +
        "Found: \n" +
        "3\n" +
        "6\n" +
        "9",
    );
  });

  it("'get' throws an error if no results match", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(() => bin.get.dividableBy(25)).toThrow(
      "No number is dividable by 25.\n" +
        "All values: \n" +
        "1\n" +
        "2\n" +
        "3\n" +
        "4\n" +
        "5\n" +
        "6\n" +
        "7\n" +
        "8\n" +
        "9\n" +
        "10",
    );
  });

  it("'get' shows special message if there are no values at all", () => {
    const bin = new QueryBin({ dividableBy });
    expect(() => bin.get.dividableBy(25)).toThrow(
      "No number is dividable by 25.\nList is completely empty!",
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
      "No number is dividable by 25.\n" +
        "All values: \n" +
        "1\n" +
        "2\n" +
        "3\n" +
        "4\n" +
        "5\n" +
        "6\n" +
        "7\n" +
        "8\n" +
        "9\n" +
        "10",
    );
  });

  it("'getAll' returns the found single value", () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(bin.getAll.dividableBy(7)).toEqual([7]);
  });

  it("'fin  dAll' return multiple results", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(await bin.findAll.dividableBy(3)).toEqual([3, 6, 9]);
  });

  it("'findAll' throws an error if no results match", async () => {
    const bin = new QueryBin({ dividableBy }, { timeoutMillis: 100 });
    bin.addAll([1, 2]);
    await expect(bin.findAll.dividableBy(3)).rejects.toThrow(
      "No number is dividable by 3.\nAll values: \n1\n2",
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
    const bin = new QueryBin({ dividableBy }, { timeoutMillis: 100 });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await expect(bin.find.dividableBy(3)).rejects.toThrow(
      "Multiple numbers are dividable by 3.\n" +
        "Found: \n" +
        "3\n" +
        "6\n" +
        "9",
    );
  });

  it("'find' throws an error if no results match", async () => {
    const bin = new QueryBin({ dividableBy }, { timeoutMillis: 100 });
    bin.addAll([1, 2]);
    await expect(bin.findAll.dividableBy(3)).rejects.toThrow(
      "No number is dividable by 3.\nAll values: \n1\n2",
    );
  });

  it("'find' returns the found single value", async () => {
    const bin = new QueryBin({ dividableBy });
    bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(await bin.find.dividableBy(7)).toEqual(7);
  });

  it("'find' return multiple results if they come in later", async () => {
    const bin = new QueryBin({ dividableBy });
    setTimeout(() => {
      bin.addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }, 100);
    expect(await bin.find.dividableBy(7)).toEqual(7);
  });

  it("'find' only waits 'timeoutMillis' milliseconds for items to appear", async () => {
    const bin = new QueryBin({ dividableBy }, { timeoutMillis: 200 });
    setTimeout(() => {
      bin.addAll([1, 2, 3]);
    }, 1000);
    await expect(bin.find.dividableBy(3)).rejects.toThrow(
      "No number is dividable by 3.\nList is completely empty!",
    );
  });

  it("'find' waits about 1000 milliseconds by default", async () => {
    const bin = new QueryBin({ dividableBy });
    setTimeout(() => {
      bin.addAll([1, 2, 3]);
    }, 900);
    expect(await bin.find.dividableBy(3)).toEqual(3);
  });

  it("'find' does not wait much longer than about 1000 milliseconds by default", async () => {
    const bin = new QueryBin({ dividableBy });
    setTimeout(() => {
      bin.addAll([1, 2, 3]);
    }, 1100);
    await expect(bin.find.dividableBy(3)).rejects.toThrow(
      "No number is dividable by 3.\nList is completely empty!",
    );
  });
});

"use strict";

class QueryBin {
  constructor(
    queries = {},
    { retryDelayMillis = 200, timeoutMillis = 1000 } = {},
  ) {
    this.values = [];
    this.retryDelayMillis = retryDelayMillis;
    this.timeoutMillis = timeoutMillis;

    this.latch = new Latch();

    this.queryAll = mapValues(queries, (factory) => {
      return (...args) => {
        const { queryAll } = factory(...args);
        return queryAll(this.values);
      };
    });
    this.query = mapValues(queries, (factory) => {
      return (...args) => {
        const queryDefinition = factory(...args);
        const results = queryDefinition.queryAll(this.values);
        if (results.length === 0) return null;
        if (results.length > 1)
          throw this.multipleResultsError(queryDefinition, results);
        return results[0];
      };
    });
    this.get = mapValues(queries, (factory) => {
      return (...args) => {
        const queryDefinition = factory(...args);
        const results = queryDefinition.queryAll(this.values);
        if (results.length === 0) throw this.noResultsError(queryDefinition);
        if (results.length > 1)
          throw this.multipleResultsError(queryDefinition, results);
        return results[0];
      };
    });
    this.getAll = mapValues(queries, (factory) => {
      return (...args) => {
        const queryDefinition = factory(...args);
        const results = queryDefinition.queryAll(this.values);
        if (results.length === 0) throw this.noResultsError(queryDefinition);
        return results;
      };
    });
    this.findAll = mapValues(queries, (factory) => {
      return async (...args) => {
        const queryDefinition = factory(...args);
        return this.waitFor(() => {
          const results = queryDefinition.queryAll(this.values);
          if (results.length === 0) throw this.noResultsError(queryDefinition);
          return results;
        });
      };
    });
    this.find = mapValues(queries, (factory) => {
      return async (...args) => {
        const queryDefinition = factory(...args);
        return this.waitFor(() => {
          const results = queryDefinition.queryAll(this.values);
          if (results.length === 0) throw this.noResultsError(queryDefinition);
          if (results.length > 1)
            throw this.multipleResultsError(queryDefinition, results);
          return results[0];
        });
      };
    });
  }

  add(value) {
    this.values.push(value);
    this.latch.next();
  }

  addAll(values) {
    this.values.push(...values);
    this.latch.next();
  }

  clear() {
    this.values = [];
  }

  all() {
    return this.values;
  }

  multipleResultsError(queryDefinition, results) {
    return new Error(
      queryDefinition.multipleFoundMessage +
        "\nFound: \n" +
        results.map(queryDefinition.serializeForErrorMessage).join("\n"),
    );
  }

  noResultsError(queryDefinition) {
    const values =
      this.values.length === 0
        ? "List is completely empty!"
        : "All values: \n" +
          this.values.map(queryDefinition.serializeForErrorMessage).join("\n");
    return new Error(`${queryDefinition.noneFoundMessage}\n${values}`);
  }

  async waitFor(fn) {
    const started = Date.now();
    while (Date.now() - started <= this.timeoutMillis) {
      try {
        return await fn();
      } catch (e) {
        const remaining = this.timeoutMillis - (Date.now() - started);
        await Promise.race([delay(remaining), this.latch.promise]);
      }
    }
    await fn();
  }
}

function mapValues(object, mapper) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      return [key, mapper(value)];
    }),
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Latch {
  constructor() {
    this.promise = new Promise((resolve) => {
      this.open = resolve;
    });
  }

  next() {
    this.open();
    this.promise = new Promise((resolve) => {
      this.open = resolve;
    });
  }
}

exports.QueryBin = QueryBin;


export class QueryBin {
  constructor(queries = {}) {
    this.values = [];
    this.queryAll = mapValues(queries, (factory) => {
      return (...args) => {
        return factory(...args).queryAll(this.values);
      };
    });
    this.query = mapValues(queries, (factory) => {
      return (...args) => {
        const queryDefinition = factory(...args);
        const results = queryDefinition.queryAll(this.values);
        if (results.length === 0) return null;
        if (results.length > 1)
          throw queryDefinition.onMultipleFound(this.values, results);
        return results[0];
      };
    });
    this.get = mapValues(queries, (factory) => {
      return (...args) => {
        const queryDefinition = factory(...args);
        const results = queryDefinition.queryAll(this.values);
        if (results.length === 0)
          throw queryDefinition.onNoneFound(this.values);
        if (results.length > 1)
          throw queryDefinition.onMultipleFound(this.values, results);
        return results[0];
      };
    });
    this.getAll = mapValues(queries, (factory) => {
      return (...args) => {
        const queryDefinition = factory(...args);
        const results = queryDefinition.queryAll(this.values);
        if (results.length === 0)
          throw queryDefinition.onNoneFound(this.values);
        return results;
      };
    });
    this.findAll = mapValues(queries, (factory) => {
      return async (...args) => {
        const queryDefinition = factory(...args);
        return this.waitFor(() => {
          const results = queryDefinition.queryAll(this.values);
          if (results.length === 0)
            throw queryDefinition.onNoneFound(this.values);
          return results;
        });
      };
    });
    this.find = mapValues(queries, (factory) => {
      return async (...args) => {
        const queryDefinition = factory(...args);
        return this.waitFor(() => {
          const results = queryDefinition.queryAll(this.values);
          if (results.length === 0)
            throw queryDefinition.onNoneFound(this.values);
          if (results.length > 1)
            throw queryDefinition.onMultipleFound(this.values, results);
          return results[0];
        });
      };
    });

  }

  add(value) {
    this.values.push(value);
  }

  addAll(values) {
    this.values.push(...values);
  }

  all() {
    return this.values;
  }

  async waitFor(fn) {
    const started = Date.now();
    while (Date.now() - started < 1000) {
      try {
        return await fn();
      } catch (e) {
        await delay(100);
      }
    }
    return fn();
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

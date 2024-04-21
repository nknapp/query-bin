export class QueryBin<T, Q extends QueryDefinitions<T> = QueryDefinitions<T>> {
  constructor(queries: Q);

  add(value: T): void;

  addAll(values: T[]): void;

  all(): T[];

  queryAll: QueryAll<T, Q>;
  query: Query<T, Q>;
  get: Get<T, Q>;
  getAll: GetAll<T, Q>;
  findAll: FindAll<T, Q>;
  find: Find<T, Q>;
}

export type Queries<T> = {
  [name: string]: (...args: any[]) => QueryDefinition<T>;
};

export type QueryDefinition<T> = {
  queryAll: (all: T[]) => T[];
  onNoneFound(all: T[]): Error;
  onMultipleFound(all: T[], found: T[]): Error;
};

export type QueryAll<T, Q extends QueryDefinitions<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T[];
};

export type Query<T, Q extends QueryDefinitions<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T | null;
};

export type Get<T, Q extends QueryDefinitions<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T;
};

export type GetAll<T, Q extends QueryDefinitions<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T[];
};

export type FindAll<T, Q extends QueryDefinitions<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => Promise<T[]>;
};

export type Find<T, Q extends QueryDefinitions<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => Promise<T>;
};

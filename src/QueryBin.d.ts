export class QueryBin<T, Q extends Queries<T> = QueryDefinitions<T>> {
  constructor(queries: Q, options?: Options);

  add(value: T): void;

  addAll(values: T[]): void;

  clear(): void;

  all(): T[];

  queryAll: QueryAll<T, Q>;
  query: Query<T, Q>;
  get: Get<T, Q>;
  getAll: GetAll<T, Q>;
  findAll: FindAll<T, Q>;
  find: Find<T, Q>;
}

interface Options {
  timeoutMillis?: number;
}

export type Queries<T> = {
  [name: string]: (...args: any[]) => QueryDefinition<T>;
};

export type QueryDefinition<T> = {
  test: (item: T) => boolean;
  serializeForErrorMessage?: (item: T) => string;
  noneFoundMessage: string;
  multipleFoundMessage: string;
};

export type QueryAll<T, Q extends Queries<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T[];
};

export type Query<T, Q extends Queries<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T | null;
};

export type Get<T, Q extends Queries<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T;
};

export type GetAll<T, Q extends Queries<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => T[];
};

export type FindAll<T, Q extends Queries<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => Promise<T[]>;
};

export type Find<T, Q extends Queries<T>> = {
  [Name in keyof Q]: (...args: Parameters<Q[Name]>) => Promise<T>;
};

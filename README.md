# query-bin

![logo](https://raw.githubusercontent.com/nknapp/query-bin/main/artwork/query-bin.svg)

<sub>This README is generated via [./scripts/build-readme.js](./scripts/build-readme.js)</sub>

## Motivation

I like the [testing-library](https://testing-library.com/) because of its [queries](https://testing-library.com/docs/queries/about#types-of-queries),
but sadly you can only apply those queries to the DOM when you are testing.

What I really miss was using them for other use-cases.

This project is an abstraction for those queries. It's a simple list of objects, but you can queries, each of which contains a

- a `queryAll` function which returns matching objects from the list.
- a `onNoneFound` function that creates an error method for the case that a result was expected, but not found.
- a `onMultipleFound` function that creates an error method for the case that a only one result was expected, but multiple were found.

What you get out are the variants `query`, `queryAll`, `get`, `getAll`, `find` and `findAll`. The expect
optional or required results, single or multiple, now or in the future.

Hve a look at https://testing-library.com/docs/queries/about#types-of-queries for details.

## Installation

```bash
npm install query-bin
```

## Example

The [tests](./src/QueryBin.test.ts) give a broad overview over the functionality, but here is also more real-life
example.

```typescript
import { QueryBin, QueryDefinition } from "..";
import { describe, expect, it } from "vitest";

type Method = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

interface Request {
  method: Method;
  url: string;
  body?: Record<string, unknown>;
}

function byMethodAndUrl(method: Method, url: string): QueryDefinition<Request> {
  return {
    queryAll: (items) =>
      items.filter((item) => item.method === method && item.url.includes(url)),
    onNoneFound: (all) =>
      new Error(
        `Could not find item with method ${method} and URL containing ${url}. All requests:\n\n${JSON.stringify(all, null, 2)}`,
      ),
    onMultipleFound: (all, found) =>
      new Error(
        `Multiple items found method ${method} and URL containing ${url}. Found:\n\n${JSON.stringify(found, null, 2)}`,
      ),
  };
}

// This might be something
const requests = new QueryBin<Request>({ byMethodAndUrl });

// Let's assume we have a component under test here.
describe("The Login component", () => {
  it("logs in with the correct credentials", async () => {
    // Simulate some requests. Those would normally originate from your component
    requests.add({ method: "GET", url: "http://localhost:8080" });

    setTimeout(() => {
      requests.add({
        method: "POST",
        body: { user: "tom", password: "tom" },
        url: "http://localhost:8080/login",
      });
    }, 500);

    // "find" waits for a single request to appear, but fails if there have been multiple requests
    const loginRequest = await requests.find.byMethodAndUrl("POST", "/login");

    expect(loginRequest.body).toEqual({ user: "tom", password: "tom" });
  });
});
```

## License

This project is licensed under the [MIT License](./LICENSE)

## Maintainance-free

Don't afraid to use this project even if the last commit is a long time ago. I tried to make it as "maintenance-free" as possible.

- There are no depencendies except for development, and I tried to keep them at a minimum.
- The library is small and has a clear scope. There might be some features missing, but I think of it as almost complete.
- I don't see any way this library may impact security.

If you like to help me maintain and update dependencies, please contact me. At the moment, I tend not to be very active
though.

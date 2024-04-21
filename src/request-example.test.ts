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
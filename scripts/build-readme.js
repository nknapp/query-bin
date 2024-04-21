import fs from "fs/promises";
import packageJson from "../package.json" assert { type: "json" };
import { editFile } from "./tools/editFile.js";

const exampleTestTs = (
  await fs.readFile("./src/example.test.ts", "utf-8")
).replace(`".."`, `"${packageJson.name}"`);

function fences(name, contents) {
  return "```" + name + "\n" + contents + "\n```";
}

await editFile("README.md", () => {
  return `
# query-bin

![logo](https://raw.githubusercontent.com/nknapp/query-bin/main/artwork/query-bin.svg)

<sub>This README is generated via [./scripts/build-readme.js](./scripts/build-readme.js)</sub>

## Introduction

I like the [testing-library](https://testing-library.com/), and one reason for that is its [queries](https://testing-library.com/docs/queries/about#types-of-queries),
you have different queries like \`byText\` and \`byRole\`, each of which comes in variations like 

* \`query\` and \`queryAll\` when finding a result is optional 
* \`get\`, \`getAll\` when finding a result is mandatory
* \`find\` and \`findAll\` when you want to wait for the result to be there

You can add custom queries but just providing a \`queryAll\` function and some error messages, but sadly everything is set around the DOM and querying HTML elements.
I always wanted to have those queries for other use-cases, such as querying requests captured by [mock-service-worker](https://mswjs.io/).

This project builds an abstraction, so that you get those queries on lists of arbitrary objects. You provide the implementation for \`queryAll\` and 
the rest will be built for you.

This project is not a finished test-utility for a given use case, but a basis so that you can build queries,  for example around \`mock-service-worker\`.

## Installation

${fences("bash", `npm install ${packageJson.name}`)}

## Example 

The [tests](./src/QueryBin.test.ts) give a broad overview over the functionality, but here is also more real-life
example.

${fences("typescript", exampleTestTs)}

## License

This project is licensed under the [MIT License](./LICENSE)

## Maintainance-free

I want to be honest. I am not good at maintaining OS projects these days. I have my turn with Handlebars.js, but now there is just to much going on in my life.
That is why I tried to make this project as "maintenance-free" as possible.

That said: If you find this package in 2026 or so and you tell yourself: "This is a dead project". Think about how much maintenance is  really required for it:

* There are no dependendies except for development, and I tried to keep them at a minimum.
* The library is small and has a clear scope. There might be some features missing, but I think of it as almost complete.
* I don't see any way this library may impact security.

If you like to help me maintain and update dependencies, please contact me. At the moment, I tend not to be very active 
though.

## Funding :coffee:

You can support me at 

* [Liberapay](https://de.liberapay.com/nils.knappmeier/)
* [Paypal](https://www.paypal.com/donate/?hosted_button_id=GB656ZSAEQEXN)

`;
});

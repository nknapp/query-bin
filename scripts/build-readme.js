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

## Motivation

I like the [testing-library](https://testing-library.com/) because of its [queries](https://testing-library.com/docs/queries/about#types-of-queries),
but sadly you can only apply those queries to the DOM when you are testing.

What I really miss was using them for other use-cases.

This project is an abstraction for those queries. It's a simple list of objects, but you can queries, each of which contains a

* a \`queryAll\` function which returns matching objects from the list.
* a \`onNoneFound\` function that creates an error method for the case that a result was expected, but not found.
* a \`onMultipleFound\` function that creates an error method for the case that a only one result was expected, but multiple were found.

What you get out are the variants \`query\`, \`queryAll\`, \`get\`, \`getAll\`, \`find\` and \`findAll\`. The expect
optional or required results, single or multiple, now or in the future.

Hve a look at https://testing-library.com/docs/queries/about#types-of-queries for details.

## Installation

${fences("bash", `npm install ${packageJson.name}`)}

## Example 

The [tests](./src/QueryBin.test.ts) give a broad overview over the functionality, but here is also more real-life
example.

${fences("typescript", exampleTestTs)}

## License

This project is licensed under the [MIT License](./LICENSE)

## Maintainance-free

Don't afraid to use this project even if the last commit is a long time ago. I tried to make it as "maintenance-free" as possible.

* There are no depencendies except for development, and I tried to keep them at a minimum.
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

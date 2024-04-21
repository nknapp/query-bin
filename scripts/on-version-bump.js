import packageJson from "../package.json" assert { type: "json" };
import cp from "child_process";
import { editFile } from "./tools/editFile.js";

cp.execSync("npm run test");

await editFile("CHANGELOG.md", (contents) => {
  return contents.replace(
    "# Upcoming\n",
    `# Upcoming

# v${packageJson.version}

Date: ${new Date().toISOString()}

`,
  );
});

cp.execSync("node ./scripts/build-readme.js");
cp.execSync("npx prettier -w .");

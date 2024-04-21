import fs from "fs/promises";
import cp from "child_process";

export async function editFile(path, editCommand) {
  const contents = await fs.readFile(path, "utf-8");
  await fs.writeFile(path, editCommand(contents));
  await cp.execSync("git add " + path);
}

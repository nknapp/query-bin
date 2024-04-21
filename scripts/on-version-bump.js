import fs from 'fs/promises'
import packageJson from "../package.json" assert { type: 'json' };

const changelog = await fs.readFile("CHANGELOG.md", "utf-8")

const updatedChangelog = changelog.replace("# Upcoming\n", `# Upcoming

# v${packageJson.version}

Date: ${new Date().toISOString()}

`)

await fs.writeFile("CHANGELOG.md",updatedChangelog)

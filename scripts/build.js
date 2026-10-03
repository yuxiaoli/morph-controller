import { access, cp, rm, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const source = resolve(projectRoot, "src");
const output = resolve(projectRoot, "dist");

// Only the fixed, generated output directory may be cleared.
if (relative(projectRoot, output) !== "dist") throw new Error("Invalid build output directory.");
await access(resolve(source, "index.html"));
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
await writeFile(resolve(output, ".nojekyll"), "");
console.log("Built src/ → dist/ (static files, no bundling).");

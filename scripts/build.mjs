// Copies only the files the website needs into dist/ (the folder that gets deployed).
import { rmSync, mkdirSync, cpSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);

for (const file of readdirSync(root).filter((f) => f.endsWith(".html"))) {
  cpSync(join(root, file), join(dist, file));
}
cpSync(join(root, "css"), join(dist, "css"), { recursive: true });
cpSync(join(root, "js"), join(dist, "js"), { recursive: true });

// Tell GitHub Pages to serve files as-is (no Jekyll processing)
writeFileSync(join(dist, ".nojekyll"), "");

console.log("Build complete → dist/");

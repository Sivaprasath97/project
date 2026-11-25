// Smoke tests: make sure every page exists, every local file it references exists,
// and the element IDs the scripts depend on are present in the HTML.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;

function check(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ ${message}`);
    failures++;
  }
}

const pages = {
  "index.html": ["loginForm", "email", "password", "remember", "forgot", "alert"],
  "register.html": ["registerForm", "name", "email", "password", "confirm", "terms", "strengthBar", "alert"],
  "dashboard.html": ["greeting", "userName", "avatar", "logoutBtn", "menuBtn", "sidebar", "chart", "activity", "ordersBody"],
};

for (const [page, ids] of Object.entries(pages)) {
  console.log(`\n${page}`);
  const path = join(root, page);
  check(existsSync(path), "file exists");
  if (!existsSync(path)) continue;

  const html = readFileSync(path, "utf8");

  // Local src/href references must point to real files
  const refs = [...html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)]
    .map((m) => m[1])
    .filter((ref) => !/^(https?:|mailto:|data:)/.test(ref) && ref !== "");
  for (const ref of refs) {
    check(existsSync(join(root, ref)), `reference "${ref}" exists`);
  }

  // IDs used by the scripts must be present
  for (const id of ids) {
    check(new RegExp(`id="${id}"`).test(html), `has #${id}`);
  }
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll smoke tests passed");
process.exit(failures ? 1 : 0);

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import weaponData from "../data/weapons.js";

// A minimal DOM double for logic tests, not a visual/browser layout test.
class Element {
  constructor() {
    this.children = [];
    this.dataset = {};
    this.style = {};
    this.value = "";
    this.textContent = "";
    this.disabled = true;
  }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; }
  querySelectorAll() { return this.children.filter((c) => c.className === "weapon-card"); }
}

async function runScript(file, response, pathname = "/weapons/2") {
  const elements = new Map();
  const requests = [];
  const document = {
    title: "",
    createElement: () => new Element(),
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new Element());
      return elements.get(id);
    },
  };
  const context = vm.createContext({
    document, window: { location: { pathname } },
    console: { error() {} },
    fetch: async (url) => { requests.push(url); return response; },
  });
  const code = await readFile(new URL(`../../client/public/scripts/${file}`, import.meta.url), "utf8");
  await vm.runInContext(code, context);
  return { document, requests, context };
}

test("search follows each card after reorder, removal, and rerender", async () => {
  const { document, context } = await runScript("weapons.js", {
    ok: true, json: async () => weaponData,
  });
  const content = document.getElementById("weapon-content");
  const input = document.getElementById("weapon-search");
  const status = document.getElementById("search-status");
  assert.equal(content.children.length, 7);
  assert.equal(input.disabled, false);
  content.children.reverse();
  input.value = "  RAPIER  ";
  input.oninput();
  const shown = content.children.filter((c) => c.style.display !== "none");
  assert.equal(shown.length, 1);
  assert.equal(shown[0].dataset.searchName, "rapier");
  input.value = "no-such-weapon";
  input.oninput();
  assert.equal(status.textContent, "No weapons match your search.");
  content.children.pop();
  input.value = "";
  input.oninput();
  assert.equal(status.textContent, "Showing 6 of 6 weapons.");
  await vm.runInContext("renderWeapons()", context);
  assert.equal(content.children.length, 7);
  assert.equal(status.textContent, "Showing 7 of 7 weapons.");
});

test("detail fetches a single record, including URLs with a trailing slash", async () => {
  const { document, requests } = await runScript("weapon.js", {
    ok: true, status: 200, json: async () => weaponData[1],
  }, "/weapons/2/");
  assert.deepEqual(requests, ["/weapons/2/data"]);
  assert.equal(document.getElementById("name").textContent, "Rapier");
  assert.equal(document.getElementById("weaponType").children[1], "Thrusting Sword");
  assert.match(document.title, /Rapier/);
});

test("detail 404 shows a missing-weapon message", async () => {
  const { document } = await runScript("weapon.js", { ok: false, status: 404 });
  assert.equal(document.getElementById("weapon-detail").textContent, "Weapon not found.");
});

for (const [file, element] of [["weapons.js", "weapon-content"], ["weapon.js", "weapon-detail"]]) {
  test(`${file} shows a readable error on HTTP 500`, async () => {
    const { document } = await runScript(file, { ok: false, status: 500 });
    assert.match(document.getElementById(element).textContent, /Unable to load/);
  });
}

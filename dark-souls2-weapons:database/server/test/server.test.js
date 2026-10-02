import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createApp } from "../app.js";
import { resetWeapons } from "../config/seed-weapons.js";
import weaponData from "../data/weapons.js";

// No database/config imports: these tests cannot load .env or contact Render.
test("HTTP routes return lists, one record, pages, 404s and safe 500s", async (t) => {
  const queries = [];
  let fail = false;
  const pool = {
    async query(sql, values) {
      queries.push({ sql, values });
      if (fail) throw new Error("private database error detail");
      return { rows: values ? weaponData.filter((w) => w.id === values[0]) : weaponData };
    },
  };
  const server = createApp(pool).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  }));
  const request = (path) => fetch(`http://127.0.0.1:${server.address().port}${path}`);

  await t.test("homepage and generated scripts are served", async () => {
    const home = await request("/");
    assert.equal(home.status, 200);
    assert.match(await home.text(), /Dark Souls II Weapon Archive/);
    const script = await request("/scripts/weapon.js");
    assert.equal(script.status, 200);
    assert.match(await script.text(), /\/data/);
  });

  await t.test("list uses explicit columns and the single camelCase alias", async () => {
    const response = await request("/weapons");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), weaponData);
    assert.match(queries.at(-1).sql, /weapon_type AS "weaponType"/);
    assert.doesNotMatch(queries.at(-1).sql, /SELECT \*/);
  });

  await t.test("every detail API returns exactly the requested object", async () => {
    for (const weapon of weaponData) {
      const response = await request(`/weapons/${weapon.id}/data`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), weapon);
      assert.match(queries.at(-1).sql, /WHERE id = \$1/);
      assert.deepEqual(queries.at(-1).values, [weapon.id]);
      const page = await request(`/weapons/${weapon.id}`);
      assert.equal(page.status, 200);
      assert.match(await page.text(), /id="weapon-detail"/);
      assert.equal((await request(weapon.image)).status, 200);
    }
  });

  await t.test("missing and malformed IDs return appropriate 404s", async () => {
    for (const id of ["999", "abc", "0", "-1", "1.5", "2147483648", "1%20OR%201=1"]) {
      const json = await request(`/weapons/${id}/data`);
      assert.equal(json.status, 404);
      assert.deepEqual(await json.json(), { error: "Weapon not found." });
      const page = await request(`/weapons/${id}`);
      assert.equal(page.status, 404);
      assert.match(await page.text(), /Lost in Drangleic/);
    }
    assert.equal((await request("/unknown-page")).status, 404);
  });

  await t.test("database failures return 500 without leaking error details", async () => {
    fail = true;
    for (const path of ["/weapons", "/weapons/1/data", "/weapons/1"]) {
      const response = await request(path);
      assert.equal(response.status, 500);
      assert.doesNotMatch(await response.text(), /private database/);
    }
  });
});

function seedPool(failAt) {
  const calls = [];
  let active = 0;
  let maxActive = 0;
  let released = false;
  let inserts = 0;
  const client = {
    async query(sql, values) {
      calls.push({ sql, values });
      maxActive = Math.max(maxActive, ++active);
      await new Promise((resolve) => setImmediate(resolve));
      active--;
      if (sql.includes("INSERT INTO") && ++inserts === failAt) throw new Error("insert failed");
      if (failAt === "schema" && sql.includes("CREATE TABLE")) throw new Error("schema failed");
      return { rows: [] };
    },
    release() { released = true; },
  };
  return {
    pool: { async connect() { return client; } }, calls,
    state: () => ({ maxActive, released }),
  };
}

test("seeding awaits all seven inserts in array order before commit", async () => {
  const fake = seedPool();
  await resetWeapons(fake.pool, weaponData);
  const inserts = fake.calls.filter((c) => c.values);
  assert.deepEqual(inserts.map((c) => c.values[0]), weaponData.map((w) => w.name));
  assert.ok(inserts.every((c) => c.values.length === 7 && c.sql.includes("weapon_type")));
  assert.equal(fake.calls[0].sql, "BEGIN");
  assert.equal(fake.calls.at(-1).sql, "COMMIT");
  assert.deepEqual(fake.state(), { maxActive: 1, released: true });
});

for (const failAt of [2, "schema"]) {
  test(`seed failure (${failAt}) rolls back and releases the connection`, async () => {
    const fake = seedPool(failAt);
    await assert.rejects(resetWeapons(fake.pool, weaponData), /failed/);
    assert.equal(fake.calls.at(-1).sql, "ROLLBACK");
    assert.ok(!fake.calls.some((c) => c.sql === "COMMIT"));
    assert.equal(fake.calls.filter((c) => c.values).length, failAt === "schema" ? 0 : 2);
    assert.equal(fake.state().released, true);
  });
}

test("start and dev never run the destructive reset", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.scripts.start, "node server.js");
  assert.equal(pkg.scripts.dev, "nodemon server.js");
});

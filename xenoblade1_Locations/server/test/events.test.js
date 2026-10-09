import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

// Inject a fake pool so these controller tests never load .env or touch Render.
const source = (await readFile(new URL("../controllers/events.js", import.meta.url), "utf8"))
  .replace('import { pool } from "../config/database.js";', "")
  .replace("export default", "globalThis.controller =");

const setup = (query) => {
  const context = vm.createContext({ pool: { query }, console: { error() {} } });
  vm.runInContext(source, context);
  const res = {
    code: 200,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
  return { controller: context.controller, res };
};

test("all-events response includes joined location fields in one query", async () => {
  let calls = 0;
  const rows = [{ id: 1, location_id: 2, title: "Watch the stars", location_name: "Eryth Sea", location_image: "/images/eryth_Sea.jpg" }];
  const { controller, res } = setup(async (sql) => {
    calls++;
    assert.match(sql, /JOIN locations AS l ON l.id = e.location_id/);
    assert.match(sql, /l.name AS location_name/);
    assert.match(sql, /l.image AS location_image/);
    assert.match(sql, /ORDER BY e.starts_at, e.id/);
    return { rows };
  });
  await controller.getEvents({}, res);
  assert.equal(calls, 1);
  assert.equal(res.code, 200);
  assert.deepEqual(res.body, rows);
});

test("empty events return an empty list", async () => {
  const { controller, res } = setup(async () => ({ rows: [] }));
  await controller.getEvents({}, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.length, 0);
});

test("query failures return 500 without leaking database details", async () => {
  const { controller, res } = setup(async () => { throw new Error("private database details"); });
  await controller.getEvents({}, res);
  assert.equal(res.code, 500);
  assert.equal(res.body.error, "Unable to load events.");
});

test("invalid location IDs never reach the database", async () => {
  for (const locationId of ["abc", "0", "-1", "1.5", "2147483648"]) {
    const { controller, res } = setup(async () => { assert.fail("Unexpected database query"); });
    await controller.getEventsByLocation({ params: { locationId } }, res);
    assert.equal(res.code, 400);
  }
});

test("missing locations still return 404", async () => {
  const { controller, res } = setup(async (sql, values) => {
    assert.match(sql, /WHERE id = \$1/);
    assert.equal(values[0], 99999);
    return { rows: [] };
  });
  await controller.getEventsByLocation({ params: { locationId: "99999" } }, res);
  assert.equal(res.code, 404);
});

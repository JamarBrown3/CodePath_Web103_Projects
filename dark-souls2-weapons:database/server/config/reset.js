import { pool } from "./database.js";
import weaponData from "../data/weapons.js";
import { resetWeapons } from "./seed-weapons.js";

// Destructive, explicit command only. Never imported by the web server.
try {
  await resetWeapons(pool, weaponData);
  console.log(`✅ Weapons table reset and ${weaponData.length} weapons inserted.`);
} catch (error) {
  console.error("⚠️ Reset failed; changes were rolled back:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

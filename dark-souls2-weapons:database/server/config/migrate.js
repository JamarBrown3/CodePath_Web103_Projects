import { pool } from "./database.js";

// Rename the existing column without dropping the table or changing any records.
// Safe to rerun after a successful migration or a reset using the new schema.
try {
  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'weapons' AND column_name = 'weapontype'
      ) THEN
        ALTER TABLE weapons RENAME COLUMN weapontype TO weapon_type;
      ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'weapons' AND column_name = 'weapon_type'
      ) THEN
        RAISE EXCEPTION 'No expected weapons column found. Check the database and schema.';
      END IF;
    END $$;
  `);
  console.log("✅ Weapons schema ready; existing records preserved.");
} catch (error) {
  console.error("⚠️ Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

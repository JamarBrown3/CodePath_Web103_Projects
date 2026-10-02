// One connection keeps the entire reset in the same transaction.
export async function resetWeapons(pool, weapons) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      DROP TABLE IF EXISTS weapons;
      CREATE TABLE weapons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        weapon_type VARCHAR(255) NOT NULL,
        damage VARCHAR(255) NOT NULL,
        scaling VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL
      );
    `);

    // Await each insert so IDs follow the array's order and failures stop the loop.
    for (const weapon of weapons) {
      await client.query(
        `INSERT INTO weapons
          (name, weapon_type, damage, scaling, image, description, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [weapon.name, weapon.weaponType, weapon.damage, weapon.scaling,
          weapon.image, weapon.description, weapon.location],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

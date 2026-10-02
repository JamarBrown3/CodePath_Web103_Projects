import { fileURLToPath } from "node:url";

// Database names stay snake_case; the API keeps the frontend's camelCase field.
const weaponColumns = `id, name, weapon_type AS "weaponType", damage,
  scaling, image, description, location`;
const pagePath = (name) =>
  fileURLToPath(new URL(`../public/${name}.html`, import.meta.url));

// Passing in the pool lets tests use fake data without loading credentials.
export default function createWeaponsController(pool) {
  const findWeapon = async (id) => {
    if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) return null;
    const results = await pool.query(
      `SELECT ${weaponColumns} FROM weapons WHERE id = $1`,
      [Number(id)],
    );
    return results.rows[0] ?? null;
  };

  const getWeapons = async (req, res) => {
    try {
      const results = await pool.query(
        `SELECT ${weaponColumns} FROM weapons ORDER BY id ASC`,
      );
      res.status(200).json(results.rows);
    } catch {
      res.status(500).json({ error: "Unable to load weapons." });
    }
  };

  const getWeapon = async (req, res) => {
    try {
      const weapon = await findWeapon(req.params.weaponId);
      if (!weapon) {
        return res.status(404).json({ error: "Weapon not found." });
      }
      res.status(200).json(weapon);
    } catch {
      res.status(500).json({ error: "Unable to load weapon." });
    }
  };

  const getWeaponPage = async (req, res) => {
    try {
      const weapon = await findWeapon(req.params.weaponId);
      if (!weapon) return res.status(404).sendFile(pagePath("404"));
      res.status(200).sendFile(pagePath("weapon"));
    } catch {
      res.status(500).type("text").send("Unable to load weapon. Please try again later.");
    }
  };

  return { getWeapons, getWeapon, getWeaponPage };
}

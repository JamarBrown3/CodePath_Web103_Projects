import express from "express";
import { fileURLToPath } from "node:url";
import WeaponsController from "../controllers/weapons.js";
import { pool } from "../config/database.js";

const router = express.Router();

// GET /weapons: sends all weapon data as JSON.

router.get("/", WeaponsController.getWeapons);

// get /weapons/1: sends the detail-page html.
router.get("/:weaponId", async (req, res) => {
  const results = await pool.query(
    "SELECT id FROM weapons WHERE id::text = $1",
    [req.params.weaponId],
  );

  const weapon = results.rows[0];

  if (!weapon) {
    return res
      .status(404)
      .sendFile(fileURLToPath(new URL("../public/404.html", import.meta.url)));
  }

  res
    .status(200)
    .sendFile(fileURLToPath(new URL("../public/weapon.html", import.meta.url)));
});

export default router;

import express from "express";
import { fileURLToPath } from "node:url";
import weaponData from "../data/weapons.js";

const router = express.Router();

// GET /weapons: sends all weapon data as JSON.

router.get("/", (req, res) => {
  res.status(200).json(weaponData);
});

// get /weapons/1: sends the detail-page html.
router.get("/:weaponId", (req, res) => {
  const weapon = weaponData.find(
    (item) => item.id === Number(req.params.weaponId),
  );

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

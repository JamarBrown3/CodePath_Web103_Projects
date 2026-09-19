import express from "express";
import weaponData from "../data/weapons.js";

const router = express.Router();

// get /weaapons: sends all weapon data as a json.

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
      .sendFile(new URL("../public/404.html", import.meta.url).pathname);
  }

  res
    .status(200)
    .sendFile(new URL("../public/weapon.html", import.meta.url).pathname);
});

export default router;

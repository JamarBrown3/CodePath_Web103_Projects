import express from "express";

export default function createWeaponsRouter(WeaponsController) {
  const router = express.Router();
  router.get("/", WeaponsController.getWeapons);
  // JSON for one record, separate from the existing detail-page URL.
  router.get("/:weaponId/data", WeaponsController.getWeapon);
  router.get("/:weaponId", WeaponsController.getWeaponPage);
  return router;
}

import express from "express";
import LocationsController from "../controllers/locations.js";
import EventsControllers from "../controllers/events.js";

const router = express.Router();

router.get("/", LocationsController.getLocations);
router.get("/:locationId", LocationsController.getLocationById);
router.get("/:locationId/events", EventsControllers.getEventsByLocation);

export default router;

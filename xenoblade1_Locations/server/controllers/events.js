import { pool } from "../config/database.js";

const getEvents = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT id, location_id, title, description, starts_at FROM events ORDER BY starts_at, id`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error loading events:", error.message);
    res.status(500).json({ error: "Unable to load events." });
  }
};

const getEventsByLocation = async (req, res) => {
  const locationId = Number(req.params.locationId);

  if (
    !Number.isInteger(locationId) ||
    locationId < 1 ||
    locationId > 2147483647
  ) {
    return res.status(400).json({ error: "Invalid location ID." });
  }

  try {
    const locationResults = await pool.query(
      "SELECT id FROM locations WHERE id = $1",
      [locationId],
    );

    if (locationResults.rows.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }
    const results = await pool.query(
      `SELECT id, location_id, title, description, starts_at FROM events WHERE location_id
        = $1 ORDER BY starts_at, id`,
      [locationId],
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error loading events:", error.message);
    res.status(500).json({ error: "Unable to load events for this location." });
  }
};

export default {
  getEvents,
  getEventsByLocation,
};

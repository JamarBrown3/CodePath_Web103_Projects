import { pool } from "../config/database.js";

const getLocations = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT id, name, description, image FROM locations ORDER BY id ASC",
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error loading locations:", error.message);
    res.status(500).json({ error: "Unable to load loacation." });
  }
};

const getLocationById = async (req, res) => {
  const locationId = Number(req.params.locationId);

  if (
    !Number.isInteger(locationId) ||
    locationId < 1 ||
    locationId > 2147483647
  ) {
    return res.status(400).json({ error: "Invalid location ID." });
  }

  try {
    const results = await pool.query(
      "SELECT id, name, description, image FROM locations WHERE id= $1",
      [locationId],
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error("Error loading location:", error.message);
    res.status(500).json({ error: "Unable to load location." });
  }
};

export default {
  getLocations,
  getLocationById,
};

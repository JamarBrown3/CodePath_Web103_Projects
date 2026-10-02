import "dotenv/config";
import { pool } from "./database.js";
import locationData from "../data/locations.js";
import eventData from "../data/events.js";

const createTables = async (client) => {
  const createTableQuery = `
  DROP TABLE IF EXISTS events;
  DROP TABLE IF EXISTS locations;
  
  CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL
  );
  
  CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES locations(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL
  );
  `;
  try {
    await client.query(createTableQuery);
    console.log("🎉 Locations and events tables created.");
  } catch (err) {
    console.error("⚠️ Error creating tables:", err.message);
    throw err;
  }
};

const seedTables = async (client) => {
  // making a way for Ids to be used for the events table
  const locationIds = new Map();
  // insert locations first and every every single generated id into the map for events table to use via for loop
  for (const location of locationData) {
    if (locationIds.has(location.name)) {
      throw new Error(`DUplication location name: $${location.name}`);
    }
    const insertQuery = `
    INSERT INTO locations (name, description, image)
    VALUES ($1, $2, $3)
    RETURNING id;
    `;

    const values = [location.name, location.description, location.image];
    const results = await client.query(insertQuery, values);
    const locationId = results.rows[0].id;

    locationIds.set(location.name, locationId);
  }

  // use the location Id primary key match when inserting events into the events table location id in events is a foreign key

  for (const event of eventData) {
    const locationId = locationIds.get(event.locationName);

    if (locationId == undefined) {
      throw new Error(
        `Unknown location "${event.locationName}" for event "${event.title}".`,
      );
    }
    const insertQuery = `
    INSERT INTO events (
    location_id, title, description, starts_at)
    VALUES ($1, $2, $3, $4);
    `;

    const values = [
      locationId,
      event.title,
      event.description,
      event.starts_at,
    ];

    await client.query(insertQuery, values);
  }
};

const resetDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await createTables(client);
    await seedTables(client);

    await client.query("COMMIT");

    console.log(
      `✅ Saved ${locationData.length} locations and ${eventData.length} events.`,
    );
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

try {
  await resetDatabase();
} catch (err) {
  console.error("⚠️ Reset failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

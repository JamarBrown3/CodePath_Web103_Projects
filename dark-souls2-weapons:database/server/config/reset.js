import { pool } from "./database.js";
import "./dotenv.js";
import weaponData from "../data/weapons.js";

const createWeaponsTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS weapons;

    CREATE TABLE IF NOT EXISTS weapons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    weaponType VARCHAR(255) NOT NULL,
    damage VARCHAR(255) NOT NULL,
    scaling VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL
);
   `;

  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉 weapons table created successfully");
  } catch (err) {
    console.error("Error creating weapons table", err);
  }
};

const insertWeaponData = async () => {
  await createWeaponsTable();
  // enter the weapons data into the weapons table
  weaponData.forEach((weapon) => {
    const insertQuery = {
      text: "INSERT INTO weapons (name, weaponType, damage, scaling, image, description, location) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    };

    const values = [
      weapon.name,
      weapon.weaponType,
      weapon.damage,
      weapon.scaling,
      weapon.image,
      weapon.description,
      weapon.location,
    ];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ Error inserting weapon data", err);
        return;
      }
      console.log(`✅ ${weapon.name} data inserted successfully`);
    });
  });
};

insertWeaponData();

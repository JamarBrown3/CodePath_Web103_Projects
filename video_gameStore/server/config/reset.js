import "dotenv/config";
import { pool } from "./database.js";
import videoGameList from "../data/videoGames.js";

const createTables = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS games;

    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      genre VARCHAR(255) NOT NULL,
      setting VARCHAR(255) NOT NULL,
      platform VARCHAR(255) NOT NULL,
      player_mode VARCHAR(255) NOT NULL,
      cover_color VARCHAR(255) NOT NULL,
      image TEXT NOT NULL,
      total_price INTEGER NOT NULL CHECK (total_price >= 0)
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("🎉 Games table created.");
  } catch (error) {
    console.error("⚠️ Error creating table:", error.message);
    throw error;
  }
};

const seedTables = async () => {
  const insertQuery = `
    INSERT INTO games (
      title, genre, setting, platform,
      player_mode, cover_color, image, total_price
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
  `;

  for (const game of videoGameList) {
    const values = [
      game.title,
      game.genre,
      game.setting,
      game.platform,
      game.player_mode,
      game.cover_color,
      game.image,
      game.total_price,
    ];

    await pool.query(insertQuery, values);
    console.log(`✅ ${game.title} added successfully`);
  }
};

try {
  await createTables();
  await seedTables();
  console.log(`🎉 Finished! Saved ${videoGameList.length} games.`);
} catch (error) {
  console.error("⚠️ Reset failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

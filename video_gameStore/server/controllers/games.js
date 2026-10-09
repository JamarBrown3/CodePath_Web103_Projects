import { pool } from "../config/database.js";
import { calculatePrice, validateGame } from "../../shared/gameRules.js";

// Validate IDs before querying PostgreSQL.
const readId = (value) => {
  if (!/^[0-9]+$/.test(String(value))) return null;

  const id = Number(value);

  return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
};

// Match the order of the SQL placeholders.
// Calculate the saved price instead of trusting the browser's price.
const gameValues = (game) => [
  game.title.trim(),
  game.genre,
  game.setting,
  game.platform,
  game.player_mode,
  game.cover_color,
  game.image.trim(),
  calculatePrice(game),
];

const serverError = (res, error) => {
  console.error("Games database error:", error);

  return res.status(500).json({
    error: "Unable to complete the request. Please try again.",
  });
};

const getAllGames = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM games ORDER BY id ASC");

    return res.status(200).json(results.rows);
  } catch (error) {
    return serverError(res, error);
  }
};

const getGamesById = async (req, res) => {
  const id = readId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Invalid game ID." });
  }

  try {
    const results = await pool.query("SELECT * FROM games WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Game not found." });
    }

    return res.status(200).json(results.rows[0]);
  } catch (error) {
    return serverError(res, error);
  }
};

const createGames = async (req, res) => {
  const validationError = validateGame(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const results = await pool.query(
      `INSERT INTO games (
        title, genre, setting, platform,
        player_mode, cover_color, image, total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      gameValues(req.body),
    );

    return res.status(201).json(results.rows[0]);
  } catch (error) {
    return serverError(res, error);
  }
};

const updateGames = async (req, res) => {
  const id = readId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Invalid game ID." });
  }

  // Our edit form sends all configuration fields.
  const validationError = validateGame(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const results = await pool.query(
      `UPDATE games SET
        title = $1,
        genre = $2,
        setting = $3,
        platform = $4,
        player_mode = $5,
        cover_color = $6,
        image = $7,
        total_price = $8
      WHERE id = $9
      RETURNING *`,
      [...gameValues(req.body), id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Game not found." });
    }

    return res.status(200).json(results.rows[0]);
  } catch (error) {
    return serverError(res, error);
  }
};

const deleteGames = async (req, res) => {
  const id = readId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Invalid game ID." });
  }

  try {
    const results = await pool.query(
      "DELETE FROM games WHERE id = $1 RETURNING *",
      [id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Game not found." });
    }

    return res.status(200).json(results.rows[0]);
  } catch (error) {
    return serverError(res, error);
  }
};

export default {
  getAllGames,
  getGamesById,
  createGames,
  updateGames,
  deleteGames,
};

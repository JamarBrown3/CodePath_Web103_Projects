import express from "express";
import GamesController from "../controllers/games.js";

const router = express.Router();

router.get("/", GamesController.getAllGames);
router.get("/:id", GamesController.getGamesById);
router.post("/", GamesController.createGames);
router.patch("/:id", GamesController.updateGames);
router.delete("/:id", GamesController.deleteGames);

export default router;

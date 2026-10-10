import { useNavigate } from "react-router-dom";
import GameForm from "../components/GameForm";
import GamesAPI from "../services/GamesAPI";

export default function CreateGame() {
  const navigate = useNavigate();
  const createGame = async (game) => {
    await GamesAPI.createGame(game);
    navigate("/games");
  };
  return <GameForm heading="Customize Your Game" submitLabel="Save Game" onSubmit={createGame} />;
}

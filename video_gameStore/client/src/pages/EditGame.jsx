import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GameForm from "../components/GameForm";
import GamesAPI from "../services/GamesAPI";

export default function EditGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const game = await GamesAPI.getGameById(id);
        if (!ignore) setResult({ id, game });
      } catch (error) {
        if (!ignore) setResult({ id, error: error.message || "Unable to load this game for editing." });
      }
    };
    load();
    return () => { ignore = true; };
  }, [id]);

  // Never show the previous record while a different ID is loading.
  if (result?.id !== id) return <p className="loading" role="status">Loading game...</p>;
  if (result.error) return <p role="alert">{result.error}</p>;
  if (!result.game) return <p role="alert">Game not found.</p>;

  const updateGame = async (game) => {
    await GamesAPI.updateGame(id, game);
    navigate("/games");
  };
  const deleteGame = async () => {
    await GamesAPI.deleteGame(id);
    navigate("/games");
  };
  return <GameForm key={id} initialValues={result.game} heading="Edit Your Game" submitLabel="Save Changes" onSubmit={updateGame} onDelete={deleteGame} />;
}

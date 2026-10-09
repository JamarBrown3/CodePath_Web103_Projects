import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GamesAPI from "../services/GamesAPI";
import themeBackgrounds from "../data/themeBackgrounds";
import "../App.css";

const GameDetails = () => {
  // for /games/7 , id is "7".

  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadGame = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await GamesAPI.getGameById(id);

        if (!ignore) {
          setGame(data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message || "Unable to load this game.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    loadGame();

    // Ignore an old response if the user leave or changes pages.
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <p className="loading" role="status">Loading game details...</p>;

  if (error) {
    return (
      <section className="game-details-page">
        <p role="alert">{error}</p>
        <Link to="/games">Back to games</Link>
      </section>
    );
  }
  if (!game) return <p>Game not found.</p>;
  return (
    <section className="game-details-page">
      <article
        className="game-details"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.65)),
            url("${themeBackgrounds[game.cover_color] || themeBackgrounds.Blue}")
          `,
        }}
      >
        <Link className="details-back-link" to="/games">← Back to Games</Link>
        <img src={game.image} alt={game.title} />

        <div className="details-information">
          <h1>{game.title}</h1>

          <p>
            <strong>Genre:</strong> {game.genre}
          </p>
          <p>
            <strong>Setting:</strong> {game.setting}
          </p>
          <p>
            <strong>Platform:</strong> {game.platform}
          </p>
          <p>
            <strong>Player Mode:</strong> {game.player_mode}
          </p>
          <p>
            <strong>Cover Color:</strong> {game.cover_color}
          </p>
          {/* Display the price actually saved in the database. */}
          <p className="details-price">
            ${(game.total_price / 100).toFixed(2)}
          </p>

          <Link to={`/edit/${game.id}`}>Edit or Delete This Game</Link>
        </div>
      </article>
    </section>
  );
};

export default GameDetails;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GamesAPI from "../services/GamesAPI";
import DeleteGameButton from "../components/DeleteGameButton";
import "../App.css";

// Use each game's saved color for its card background.
import themeBackgrounds from "../data/themeBackgrounds";

const ViewGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const fetchGames = async () => {
      try {
        const data = await GamesAPI.getAllGames();

        if (!ignore) {
          setGames(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error loading games:", error);
          setError("Unable to load games. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchGames();

    return () => {
      ignore = true;
    };
  }, []);

  // The reusable confirmation component handles pending/error feedback.
  const handleDelete = async (game) => {
    await GamesAPI.deleteGame(game.id);
    setGames((previous) => previous.filter((item) => item.id !== game.id));
  };

  if (loading) {
    return (
      <div>
        <p className="loading" role="status">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="games-page">
      <h1 className="games-title">Your Custom Games</h1>
      {games.length === 0 && <p>No games saved yet. Create your first one!</p>}

      {/* this is for the games to be displayed as a grid with the title and image based on game id*/}
      <div className="games-grid">
        {games.map((game) => (
          <article
            className="game-card"
            key={game.id}
            style={{
              backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.85)),
            url("${themeBackgrounds[game.cover_color]}")`,
            }}
          >
            <img src={game.image} alt={game.title} />

            <h2>{game.title}</h2>

            <p>Genre: {game.genre}</p>
            <p>Platform: {game.platform}</p>
            <p>Player Mode: {game.player_mode}</p>

            <p>Price: ${(game.total_price / 100).toFixed(2)}</p>
            <footer>
              <Link to={`/games/${game.id}`}>View Details</Link>
              <Link to={`/edit/${game.id}`}>Edit</Link>
              <DeleteGameButton
                title={game.title}
                onDelete={() => handleDelete(game)}
              />
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ViewGames;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GamesAPI from "../services/GamesAPI";
import React from "react";
import "../App.css";

//importing themese to make sure the games background changes based on their database color
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

  // Delete a game straight from the list view.
  // Ask first, call the API, then remove the card from state so the list
  // updates without reloading the page.
  const handleDelete = async (game) => {
    const confirmed = window.confirm(
      `Delete "${game.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await GamesAPI.deleteGame(game.id);
      setGames((previous) => previous.filter((item) => item.id !== game.id));
    } catch (error) {
      console.error("Error deleting game:", error);
      window.alert("Unable to delete the game. Please try again.");
    }
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
    return <div>{error}</div>;
  }

  return (
    <section className="games-page">
      <h1 className="games-title">Your Custom Games</h1>
      {/* this code uses the short circuit evaluation to conditionally render the
      list of games if there are any */}
      {loading && <p>Loading games...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && games.length === 0 && (
        <p>No games saved yet. Create your first one!</p>
      )}

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
              <button
                type="button"
                className="delete-game-button"
                onClick={() => handleDelete(game)}
              >
                Delete
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ViewGames;

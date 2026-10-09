import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GamesAPI from "../services/GamesAPI";
import gameOptions from "../data/gameOptions";
import themeBackgrounds from "../data/themeBackgrounds";
import calculatePrice from "../utilities/calculatePrice";
import "../App.css";

const EditGame = () => {
  // React Router navigation: return to the list after a successful save.
  const navigate = useNavigate();

  // Get the game ID from the URL parameters.
  const { id } = useParams();

  // Stores the user's current selections.
  // These property names match the fields our backend expects.
  const [game, setGame] = useState({
    title: "",
    image: "",
    genre: "Adventure",
    setting: "Fantasy",
    platform: "PC",
    player_mode: "Single-player",
    cover_color: "Blue",
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadGame = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const savedGame = await GamesAPI.getGameById(id);

        if (!ignore) {
          // Populate the form with the saved game data.

          setGame(savedGame);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error loading game:", error);
          setLoadError("Unable to load this game for editing.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadGame();

    return () => {
      ignore = true;
    };
  }, [id]);

  // Display request errors and disable the form while a save is pending.
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Derive the price from the selections instead of keeping duplicate state.
  // The utility returns cents; divide by 100 when displaying dollars.
  const totalPrice = calculatePrice(game);

  // A fictional compatibility rule for this store, not a real-world
  // limitation of all handheld systems.
  const incompatible =
    game.platform === "Handheld" && game.player_mode === "Online";

  // Describes our dropdowns so we can render them with .map().
  // Each "name" must match a property in the game state object.
  const fields = [
    { name: "genre", label: "Genre", options: gameOptions.genres },
    { name: "setting", label: "Setting", options: gameOptions.settings },
    { name: "platform", label: "Platform", options: gameOptions.platforms },
    {
      name: "player_mode",
      label: "Player Mode",
      options: gameOptions.playerModes,
    },
    {
      name: "cover_color",
      label: "Cover Color",
      options: gameOptions.coverColors,
    },
  ];

  // One handler works for every input and dropdown.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setGame((previous) => ({
      ...previous, // Keep all the other selections.
      [name]: value, // Update only the field that changed.
    }));
  };

  const handleSubmit = async (event) => {
    // Prevent the browser's default form submission and page reload.
    event.preventDefault();
    setError("");

    // Check again on submission, even though the button is disabled
    // when this combination is selected.
    if (incompatible) {
      setError("Our handheld package does not support online multiplayer.");
      return;
    }

    // HTML "required" catches empty fields; trim also catches spaces only.
    if (!game.title.trim() || !game.image.trim()) {
      setError("Enter a game title and an image path or URL.");
      return;
    }

    setSaving(true);

    try {
      // The service sends a PATCH request to Express.
      // Express updates the existing database record.
      //
      // Frontend checks are for user feedback. The backend must also
      // validate choices and calculate the authoritative saved price.
      await GamesAPI.updateGame(id, {
        ...game,
        title: game.title.trim(),
        image: game.image.trim(),
        total_price: totalPrice,
      });

      // Navigate only after the request succeeds.
      navigate("/games");
    } catch (error) {
      console.error("Error updating game:", error);
      setError(error.message || "Unable to save your game. Please try again.");
    } finally {
      // Re-enable the form if saving failed and the user needs to retry.
      setSaving(false);
    }
  };

  // adding a deelte button to delete the game from the database and navigate back to the games page

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${game.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setSaving(true);

    try {
      await GamesAPI.deleteGame(id);
      navigate("/games");
    } catch (error) {
      console.error("Error deleting game:", error);
      setError(
        error.message || "Unable to delete your game. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="loading" role="status">Loading game...</p>;
  }

  if (loadError) {
    return <p role="alert">{loadError}</p>;
  }

  return (
    <section className="customize-page">
      <header className="customize-intro">
        <h1>Edit Your Game</h1>
        <p>Choose your options and watch your preview update.</p>
      </header>

      <div className="customize-layout">
        {/* onSubmit handles clicking Save and submitting with Enter. */}
        <form onSubmit={handleSubmit}>
          <fieldset disabled={saving}>
            <label htmlFor="title">Game Title</label>
            <input
              id="title"
              name="title"
              value={game.title}
              onChange={handleChange}
              maxLength={255}
              required
            />

            <label htmlFor="image">Cover Image Path or URL</label>
            <input
              id="image"
              name="image"
              value={game.image}
              onChange={handleChange}
              placeholder="/images/BloodRayne.jpeg"
              required
            />

            {/* Outer map creates dropdowns; inner map creates their options. */}
            {fields.map((field) => (
              <label key={field.name} htmlFor={field.name}>
                {field.label}

                <select
                  id={field.name}
                  name={field.name}
                  value={game[field.name]}
                  onChange={handleChange}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            {/* Early feedback for incompatible choices. */}
            {incompatible && (
              <p className="form-error" role="alert">
                Our handheld package does not support online multiplayer.
              </p>
            )}

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <p className="game-total">
              Total: ${(totalPrice / 100).toFixed(2)}
            </p>

            <button type="submit" disabled={incompatible || saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="delete-game-button"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete Game
            </button>
          </fieldset>
        </form>

        {/* The selected color chooses a background image.
            The gradient keeps the text readable over that image. */}
        <article
          className="game-preview"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.85)),
              url("${themeBackgrounds[game.cover_color]}")
            `,
          }}
        >
          <h2>{game.title || "Your Game Preview"}</h2>

          {/* Only render the cover image after a path or URL is entered. */}
          {game.image ? (
            <img src={game.image} alt={game.title || "Game cover"} />
          ) : (
            <p className="preview-placeholder">
              Enter an image path or URL to preview your cover.
            </p>
          )}

          <p>
            {game.genre} · {game.platform}
          </p>
          <p>Setting: {game.setting}</p>
          <p>{game.player_mode}</p>
          <p className="game-total">${(totalPrice / 100).toFixed(2)}</p>
        </article>
      </div>
    </section>
  );
};

export default EditGame;

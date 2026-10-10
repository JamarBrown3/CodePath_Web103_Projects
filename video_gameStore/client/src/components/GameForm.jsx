import { useRef, useState } from "react";
import { calculatePrice, gameOptions, validateGame, getCompatibilityError } from "../../../shared/gameRules.js";
import themeBackgrounds from "../data/themeBackgrounds";
import DeleteGameButton from "./DeleteGameButton";
import "../App.css";

const defaults = {
  title: "", image: "", genre: "Adventure", setting: "Fantasy",
  platform: "PC", player_mode: "Single-player", cover_color: "Blue",
};
const fields = [
  { name: "genre", label: "Genre", options: gameOptions.genres },
  { name: "setting", label: "Setting", options: gameOptions.settings },
  { name: "platform", label: "Platform", options: gameOptions.platforms },
  { name: "player_mode", label: "Player Mode", options: gameOptions.playerModes },
  { name: "cover_color", label: "Cover Color", options: gameOptions.coverColors },
];

// Pages supply persistence; this component owns the form and live preview.
// Mount after initialValues load; use a new key when editing a different ID.
export default function GameForm({ initialValues = defaults, heading, submitLabel, onSubmit, onDelete }) {
  const [game, setGame] = useState(() => ({ ...defaults, ...initialValues }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const submitting = useRef(false);
  const totalPrice = calculatePrice(game);
  const compatibilityError = getCompatibilityError(game);
  const busy = saving || deleting;

  const handleChange = ({ target: { name, value } }) => {
    setGame((previous) => ({ ...previous, [name]: value }));
    setError("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting.current || deleting) return;
    const validationError = validateGame(game);
    setError(validationError);
    if (validationError) return;
    submitting.current = true;
    setSaving(true);
    try {
      await onSubmit({ ...game, title: game.title.trim(), image: game.image.trim(), total_price: totalPrice });
    } catch (error) {
      setError(error.message || "Unable to save your game. Please try again.");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  return (
    <section className="customize-page">
      <header className="customize-intro">
        <h1>{heading}</h1>
        <p>Choose your options and watch your preview update.</p>
      </header>
      <div className="customize-layout">
        <form onSubmit={handleSubmit}>
          <fieldset disabled={busy}>
            <label htmlFor="title">Game Title</label>
            <input id="title" name="title" value={game.title} onChange={handleChange} maxLength={255} required />
            <label htmlFor="image">Cover Image Path or URL</label>
            <input id="image" name="image" value={game.image} onChange={handleChange} placeholder="/images/BloodRayne.jpeg" required />
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <select id={field.name} name={field.name} value={game[field.name]} onChange={handleChange}>
                  {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            ))}
            {compatibilityError && <p className="form-error" role="alert">{compatibilityError}</p>}
            {error && error !== compatibilityError && <p className="form-error" role="alert">{error}</p>}
            <p className="game-total">Total: ${(totalPrice / 100).toFixed(2)}</p>
            <button type="submit" disabled={Boolean(compatibilityError) || busy}>{saving ? "Saving..." : submitLabel}</button>
          </fieldset>
          {onDelete && <DeleteGameButton title={game.title} label="Delete Game" disabled={saving} onDelete={onDelete} onPendingChange={setDeleting} />}
        </form>
        <article className="game-preview" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.85)), url("${themeBackgrounds[game.cover_color] || themeBackgrounds.Blue}")` }}>
          <h2>{game.title || "Your Game Preview"}</h2>
          {game.image ? <img src={game.image} alt={game.title || "Game cover"} /> : <p className="preview-placeholder">Enter an image path or URL to preview your cover.</p>}
          <p>{game.genre} · {game.platform}</p>
          <p>Setting: {game.setting}</p>
          <p>{game.player_mode}</p>
          <p className="game-total">${(totalPrice / 100).toFixed(2)}</p>
        </article>
      </div>
    </section>
  );
}

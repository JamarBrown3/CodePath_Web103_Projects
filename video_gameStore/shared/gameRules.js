// The frontend and backend share the same options and pricing rules.
export const gameOptions = {
  genres: ["RPG", "Adventure", "Racing"],
  settings: ["Fantasy", "Space", "Futuristic City"],
  platforms: ["PC", "Console", "Handheld"],
  playerModes: ["Single-player", "Local co-op", "Online"],
  coverColors: ["Red", "Blue", "Green"],
};

// Return whole cents: 2000 means $20.00.
export const calculatePrice = (game) => {
  const genrePrices = {
    Adventure: 0,
    Racing: 500,
    RPG: 1000,
  };

  const modePrices = {
    "Single-player": 0,
    "Local co-op": 500,
    Online: 1000,
  };

  return 2000 + genrePrices[game.genre] + modePrices[game.player_mode];
};

// Return an error message, or an empty string when everything is valid.
export const validateGame = (game) => {
  if (!game || typeof game !== "object" || Array.isArray(game)) {
    return "Game information is required.";
  }

  if (
    typeof game.title !== "string" ||
    !game.title.trim() ||
    game.title.trim().length > 255
  ) {
    return "Enter a title between 1 and 255 characters.";
  }

  if (typeof game.image !== "string" || !game.image.trim()) {
    return "Enter a cover image path or URL.";
  }

  const allowedOptions = {
    genre: gameOptions.genres,
    setting: gameOptions.settings,
    platform: gameOptions.platforms,
    player_mode: gameOptions.playerModes,
    cover_color: gameOptions.coverColors,
  };

  for (const [field, options] of Object.entries(allowedOptions)) {
    if (!options.includes(game[field])) {
      return `Choose a valid ${field.replaceAll("_", " ")}.`;
    }
  }

  // Fictional compatibility rule for this store.
  if (game.platform === "Handheld" && game.player_mode === "Online") {
    return "Our handheld package does not support online multiplayer.";
  }

  return "";
};

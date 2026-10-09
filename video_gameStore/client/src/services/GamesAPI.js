// Shared response handling for all five requests.

// This function checks if the response is OK (status code 200-299). If not, it throws an error with the status code. If the response is OK, it returns the parsed JSON data from the response.
const readResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || `Request failed (${response.status}).`
    );
  }

  if (data === null) {
    throw new Error("The server returned an unexpected response.");
  }

  return data;
};

// This function fetches all games from the API. It sends a GET request to the "/api/games" endpoint and returns the parsed JSON data using the readResponse function.
const getAllGames = async () => {
  const response = await fetch("/api/games");
  return readResponse(response);
};

// This function fetches a specific game by its ID from the API. It sends a GET request to the "/api/games/:id" endpoint and returns the parsed JSON data using the readResponse function.
const getGameById = async (id) => {
  const response = await fetch(`/api/games/${id}`);
  return readResponse(response);
};

// This function creates a new game in the API. It sends a POST request to the "/api/games" endpoint with the game data in the request body and returns the parsed JSON data using the readResponse function.
const createGame = async (game) => {
  const response = await fetch("/api/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });
  return readResponse(response);
};

// This function updates an existing game in the API. It sends a PATCH request to the "/api/games/:id" endpoint with the updated game data in the request body and returns the parsed JSON data using the readResponse function.
const updateGame = async (id, game) => {
  const response = await fetch(`/api/games/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  return readResponse(response);
};

// This function deletes a specific game by its ID from the API. It sends a DELETE request to the "/api/games/:id" endpoint and returns the parsed JSON data using the readResponse function.
const deleteGame = async (id) => {
  const response = await fetch(`/api/games/${id}`, {
    method: "DELETE",
  });

  return readResponse(response);
};

export default {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};

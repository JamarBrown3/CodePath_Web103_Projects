import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Navigation from "./components/Navigation";
import ViewGames from "./pages/ViewGames";
import EditGame from "./pages/EditGame";
import CreateGame from "./pages/CreateGame";
import GameDetails from "./pages/GameDetails";
import "./App.css";

const App = () => {
  let element = useRoutes([
    {
      path: "/",
      element: <ViewGames />,
    },
    {
      path: "/create",
      element: <CreateGame />,
    },
    {
      path: "/games",
      element: <ViewGames />,
    },
    {
      path: "/customgames",
      element: <Navigate to="/games" replace />,
    },
    {
      path: "/games/:id",
      element: <GameDetails />,
    },
    {
      path: "/edit/:id",
      element: <EditGame title="Games | Edit Games" />,
    },
    {
      path: "*",
      element: <h2>404 - Page Not Found</h2>,
    },
  ]);

  return (
    <div className="app">
      <Navigation />

      {element}
    </div>
  );
};

export default App;

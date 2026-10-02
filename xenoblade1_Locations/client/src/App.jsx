import React from "react";
import { useRoutes, Link } from "react-router-dom";
import Locations from "./pages/Locations";
import LocationEvents from "./pages/LocationEvents";
import Events from "./pages/Events";
import "./App.css";

const App = () => {
  let element = useRoutes([
    {
      path: "/",
      element: <Locations />,
    },
    {
      path: "/locations/:locationId",
      element: <LocationEvents />,
    },
    {
      path: "/events",
      element: <Events />,
    },
    {
      path: "*",
      element: <h1>404 - Page Not Found</h1>,
    },
  ]);

  return (
    <div className="app">
      <header className="main-header">
        <h1>Xenoblade Chronicles Community Events</h1>

        <div className="header-buttons">
          <Link to="/" role="button">
            Home
          </Link>
          <Link to="/events" role="button">
            Events
          </Link>
        </div>
      </header>

      <main>{element}</main>
    </div>
  );
};

export default App;

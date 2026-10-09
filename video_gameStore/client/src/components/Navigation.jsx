import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../css/Navigation.css";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <h1>Video Game Store 🎮🕹️</h1>
        </li>
      </ul>

      <ul>
        <li>
          <Link to="/" role="button">
            View Games
          </Link>
        </li>
        <li>
          <Link to="/create" role="button">
            Create Game
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

# WEB103 Project 4 - Video Game Store

Submitted by: **Jamar Brown**

About this web app: **Video Game Store is a full-stack game customizer. Users choose a game's genre, setting, platform, player mode, cover image, and cover color, preview the configuration and its price, and then save, view, edit, or delete their custom games. Data is stored in a Render-hosted PostgreSQL database and served through a Node.js/Express REST API to a React frontend. This is an educational demo: prices and compatibility rules are fictional, and no purchases are processed.**

Time spent: **8** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.** (The table is named `games`.)
  - [X]  **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [X]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [x] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
- [x] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
- [ ] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
- [x] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
- [x] **The visual interface changes in response to at least one customizable feature.**
- [x] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [x] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
- [x] **Users can view a list of all submitted `CustomItem`s.**
- [x] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
  - Each game card in the list has a Delete button that asks for confirmation and removes the game from the database and the list.
- [x] **Users can update or delete `CustomItem`s that have been created from the detail page.**
  - The detail page has an "Edit or Delete This Game" link that opens the edit page, where a game can be updated or deleted (with a confirmation prompt).


The following **optional** features are implemented:

- [x] Selecting particular options prevents incompatible options from being selected even before form submission
  - Choosing **Handheld** with **Online** displays a warning right away and disables the Save button until the combination is changed.

The following **additional** features are implemented:

- [x] The backend validates every submitted game and calculates the saved price itself, instead of trusting the price sent by the browser.
- [x] Shared pricing and validation rules (`shared/gameRules.js`) keep the frontend and backend consistent.
- [x] Live preview that updates as options change, including a background that changes with the selected cover color (Red, Blue, or Green).
- [x] Individual game detail pages with their own URLs.
- [x] Delete confirmation prompt before a game is removed.
- [x] Loading and error messages for every page that fetches data.
- [x] Home page shows all saved games, with a separate `/create` page for new games.

## Video Walkthrough

Here's a walkthrough of implemented required features:

Video Walkthrough here: https://drive.google.com/file/d/1WQXZIV--Gq4v3JTRD5dI8gGbadRC-q5f/view?usp=sharing

<!-- GIF created with QuickTime Player screen recording -->


## Notes

The app has four pages: a home page listing saved games (`/`), a create page (`/create`), a detail page (`/games/:id`), and an edit page (`/edit/:id`). The API supports GET and POST at `/api/games`, and GET, PATCH, and DELETE at `/api/games/:id`. To run it locally, install dependencies with `npm install`, put the Render database settings in a private `server/.env`, run `npm run reset` once on a new database to create and seed the table, and then start everything with `npm run dev`.

Challenges encountered included:

- **A 502 Bad Gateway when saving a new game.** The browser only showed a generic failed request. The real cause was that the Express server was not running behind Vite's proxy (port 3000). I found it by testing the API directly with `curl`, reading the server's terminal output, and restarting with `npm run dev`. The lesson was to find which layer is failing (browser, proxy, server, or database) before changing code.
- **A flipped landing page.** The home route (`/`) loaded the Create Game form instead of the list of games. I moved Create Game to `/create`, made `/` show the list, updated the navigation links, and kept `/games` so the redirects after saving and deleting still work.
- **Understanding how the pieces connect.** Learning how React pages call the services files, which call Express routes, which call controllers, which query PostgreSQL, and what GET, POST, PATCH, and DELETE mean in a REST API.
- Connecting the React forms to the API and matching field names across JavaScript and SQL.
- Fixing navigation paths, handling loading and error states, and keeping text readable against the game-art background.

I used AI assistance (OpenAI Codex, ChatGPT, and Claude) for explanations, debugging guidance, and code examples while adapting and testing the project. Connection settings are stored in a private `server/.env` file that is excluded from Git. Game titles and artwork belong to their respective owners and are used as educational demo content only.

## License

Copyright 2026 Jamar Brown

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

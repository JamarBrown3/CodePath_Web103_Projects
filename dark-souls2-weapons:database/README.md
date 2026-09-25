# Web Development Project 2 - Dark Souls II Weapon Archive

Submitted by: **Jamar Brown**

Project: **Project 2: Listicle Part 2**

This web app: **A Dark Souls-themed weapon archive where users can browse
seven weapons, search by weapon name, and open individual detail pages.
Weapon records are stored in a Render-hosted PostgreSQL database and
retrieved through a Node.js/Express backend. The frontend uses vanilla
HTML, CSS, JavaScript, and Pico CSS.**

Time spent: **[3.30]** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] The web app uses only HTML, CSS, and JavaScript without a frontend framework.
- [x] Data is supplied to the app using a Render PostgreSQL database.
  - [x] The web app is connected to a Render PostgreSQL database.
  - [x] The database contains an appropriately structured table for the list items.

The following **stretch** features are implemented:

- [x] Users can search for items with a specific attribute.
  - Users can search weapons by name.
  - Search is case-insensitive and supports partial matches.
  - Clearing the search restores all weapon cards.
  - A message appears when no weapons match.

The following **additional** features are implemented:

- [x] Seven weapon records are displayed as cards.
- [x] Each weapon has a corresponding detail page.
- [x] Invalid weapon IDs and unknown routes display a custom 404 page.
- [x] The homepage and 404 page use different background images.
- [x] The site uses Pico CSS and custom dark-themed styling.
- [x] The layout includes responsive cards and a mobile detail-page layout.
- [x] Navigation links allow users to return to the weapon archive.

## Video Walkthrough

Here's a walkthrough of implemented required and stretch features:

**[https://drive.google.com/file/d/1_8uPy7tjRZzYrdUZs6UBrtjceTRLRB25/view?usp=sharing]**

Recording tool: **[QuickTimePlayer by Mac OS]**

## Notes

This project builds on my Unit 1 weapon archive by replacing direct access
to a JavaScript array with PostgreSQL queries.

The backend uses the pg package to connect to a Render PostgreSQL database.
A setup script creates the weapons table and inserts the initial weapon
records. An Express controller retrieves records from the database and
returns them as JSON. The frontend fetches those records and displays
weapon cards.

The detail route also checks the database to determine whether a weapon
exists before serving its detail page. Search runs in the browser against
the weapon records retrieved from the API.

Challenges encountered included:

- Understanding the difference between a database and a table.
- Reusing one Render database for separate gifts and weapons tables.
- Loading environment variables from the correct working directory.
- Understanding default imports and named imports.
- Organizing table creation and insertion code inside the correct functions.
- Replacing references to the old weaponData array in the routes.
- Understanding when to restart Express and when to rebuild the frontend.
- Adding a name search without introducing a frontend framework.

Connection settings are stored in a private server/.env file excluded
from Git. Frontend source files are maintained in client/, while
server/public/ contains generated build output.

The current reset script drops and recreates the weapons table. The
current npm start script runs that reset before starting Express, so
starting it through that command replaces existing weapon records with
the sample data.

I used AI assistance for explanations, debugging guidance, and code
examples while adapting and testing the project.

## License

Copyright 2026 Jamar Brown

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Game artwork and other third-party assets remain the property of their
respective owners and are not covered by the license for this project's
original code.
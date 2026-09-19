# Web Development Project 1 - Dark Souls II Weapon Archive

Submitted by: **Jamar Brown**

Project: **Project 1: Listicle Part 1**

This web app: **A Dark Souls-themed weapon archive where users can browse
seven weapon entries and open individual detail pages. Each entry includes
an image and information about its weapon type, damage type, scaling,
description, and location. The project uses vanilla HTML, CSS, JavaScript,
Pico CSS, and a Node.js/Express backend.**

Time spent: **[5]** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] The web app uses only HTML, CSS, and JavaScript without a frontend framework.
- [x] The front page is functional and appropriately styled.
  - [x] The web app displays a title.
  - [x] The website displays at least five unique list items.
  - [x] Each list item includes at least three displayed attributes.
- [x] Each list item has a corresponding detail page.
  - [x] The user can click each item to see a detailed view including all data fields.
- [x] The web app serves an appropriate 404 page when no matching route is defined.
- [x] The webpage is styled with Pico CSS.

The following **stretch** features are implemented:

- [x] List items are displayed in a unique format using weapon cards.

The following **additional** features are implemented:

- [x] Seven weapon entries are available to browse.
- [x] The homepage and 404 page have different background images.
- [x] Custom CSS adds a dark theme with gold accents.
- [x] A shared navigation header links back to the weapon archive.
- [x] The browser tab title changes to the selected weapon's name.
- [x] CSS includes a responsive card grid and a mobile detail-page layout.

## Video Walkthrough

Here's a walkthrough of implemented required features:

**Recording will be added before submission.**

Video created with **[QuickTime player on mac os]**.
The video link is here at: https://drive.google.com/file/d/1bMKQ-vpFMAUh2RSK4JbCMZ7kUQ4WtU2V/view?usp=sharing

## Notes

Challenges encountered while building this project included:

- Understanding the difference between Vite's development server on port
  5173 and the Express server on port 3001.
- Learning that the frontend must be rebuilt before Express can serve
  updated client files.
- Debugging requests that returned HTML when the JavaScript expected JSON.
- Troubleshooting a 502 error when the development proxy could not obtain
  a valid response from the backend.
- Correcting spelling mistakes in configuration keys, HTML attributes,
  and JavaScript properties.
- Understanding the difference between the script that renders all weapon
  cards and the script that renders one weapon's details.
- Connecting local images and stylesheets using the correct public URLs.
- Testing unknown routes through Express to verify the custom 404 page.

The project currently stores weapon records in a JavaScript array on the
server. It does not yet use a connected database.

I used AI assistance for explanations, debugging guidance, and starter
code while assembling and adapting the project.

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

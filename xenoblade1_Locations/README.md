# WEB103 Project 3 - Xenoblade Community Space

Submitted by: **Jamar Brown**

About this web app: **A Xenoblade Chronicles-themed virtual community space where players can explore five in-game locations (Gaur Plain, Eryth Sea, Bionis' Interior, Mechonis Field, and Fallen Arm) and find community events for each one, like exploration walks, screenshot challenges, and strategy meetups. Location and event data is stored in a Render-hosted PostgreSQL database, served through a Node.js/Express API, and displayed with a React frontend.**

Time spent: **7** hours spent in total (across two days)

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->

- [x] **The web app uses React to display data from the API**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured Events table**
  - [x] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x] **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [x] **The web app displays a title.**
- [x] **Website includes a visual interface that allows users to select a location they would like to view.**
  - [x] *Note: A non-visual list of links to different locations is insufficient.*
- [x] **Each location has a detail page with its own unique URL.**
- [x] **Clicking on a location navigates to its corresponding detail page and displays list of all events from the `events` table associated with that location.**

The following **optional** features are implemented:

- [x] An additional page shows all possible events
  - [x] Users can sort *or* filter events by location.
- [x] Events display a countdown showing the time remaining before that event
- [x] Events appear with different formatting when the event has passed (ex. negative time, indication the event has passed, crossed out, etc.).

The following **additional** features are implemented:

- [x] Location dropdown on the All Events page that filters events and shows a message when a location has no events.
- [x] Each event card shows its location's image and name.
- [x] Countdown updates live every second.
- [x] Past events are grayed out with a crossed-out title and a "This event has passed" message. The seed data includes one past event (Gaur Plain Sunrise Meetup) so this can be seen right away.
- [x] Loading and error messages appear while event data is fetched.
- [x] Shared banner header with the site title and Home and Events navigation buttons, which stacks on small screens.
- [x] Dark, left-aligned event cards with consistent image sizes on the All Events page.
- [x] Custom page background, stylized red title, and browser tab title.

## Video Walkthrough

Here's a walkthrough of implemented required features:

Video walkthrough: https://drive.google.com/file/d/1W8arqzMSffwSMcJQIYtvSOabs71CW5mB/view?usp=sharing

<!-- Replace this with whatever GIF tool you used! -->
Video created with **Quick Time Player Mac OS**


## Notes

The backend connects to a Render PostgreSQL database with the `pg` package. A reset script (`npm run reset`) creates the locations and events tables and seeds them with sample data. Express controllers read from those tables, and routes expose them as JSON at `/api`. The React frontend calls the API through small service files (`EventsAPI` and `LocationsAPI`) and renders the results.

The All Events page loads every event and location, then filters events in React state based on the location dropdown. Each event card receives its location's name and image by matching `location_id` to the location's database ID. The countdown is its own component that recalculates the time remaining every second and shows a "passed" message once the start time is behind the current time.

Challenges encountered included:

- **Mixing up `Event.jsx` and `Events.jsx`.** The card component (`Event.jsx`) and the all-events page (`Events.jsx`) have almost the same name. I fixed the card first, so the location pages worked, but the banner's Events button still showed placeholder text because `Events.jsx` had never been connected to the API. I had to slow down and fix them one at a time.
- **Header and navigation layout.** My oversized title took up the whole row and pushed the Home and Events buttons underneath it. I fixed it with a shared dark banner, title on the left and buttons on the right, that stacks on small screens.
- **CSS specificity.** A global `#root h1` rule made every heading huge, so the banner title needed a more specific selector. The first fix also swapped out my stylized font for readability, so I put the Rock Salt font back and picked a red title with a subtle glow to match the Xenoblade look.
- **Styling** the all-events page.** The cards started out unbalanced and hard to read. I gave them dark backgrounds, left-aligned text, a location image and name on every card, and consistent image sizes. I also removed fixed-height styling that made the text overlap.
- **A stray `margin-left`.** An image was pushed out of place by a `margin-left` in the starter CSS, which turned out to be a box model issue.
- **Location filter state.** The dropdown value is always a string, but `location_id` is a number, so the filter did not match until I compared them as strings. I also had the dropdown in place but forgot to define the state and to map over the filtered list instead of the full list.
- **Dates, countdown, and past events.** The countdown and past-event styling depend on `starts_at` being a real timestamp. To demonstrate the passed-event formatting, I added a past event (Gaur Plain Sunrise Meetup) to the seed data and reran `npm run reset`, which brought the total to 11 events.
- **Vite image path warning.** I referenced a background image as `/public/images/...`, but Vite serves the `public` folder from the root, so the path needed to be `/images/...`.
- **Reviewing AI suggestions.** Some editor suggestions, like Copilot wanting to delete the event image tag, were wrong, so I checked each one against what the page actually needed before accepting it.

Connection settings are stored in a private `server/.env` file that is excluded from Git.

I used AI assistance (ChatGPT, Claude, and GitHub Copilot) for explanations, debugging guidance, and code examples while adapting and testing the project.

## License

Copyright 2026 Jamar Brown

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Game artwork and other third-party assets remain the property of their
respective owners and are not covered by the license for this project's
original code.

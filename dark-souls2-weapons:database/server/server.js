import express from "express";
import "./config/dotenv.js";
import { fileURLToPath } from "node:url";
import weaponsRouter from "./routes/weapons.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Serves front end files html , css, images and javascript
const publicDirectory = fileURLToPath(new URL("./public/", import.meta.url));
app.use(express.static(publicDirectory));

// makes the weapon api and detail routes available.
app.use("/weapons", weaponsRouter);

// Runs if no route above matched.
app.use((req, res) => {
  res
    .status(404)
    .sendFile(fileURLToPath(new URL("./public/404.html", import.meta.url)));
});

app.listen(PORT, () => {
  console.log(`⚔️ Dark Souls II server running at http://localhost:${PORT}`);
});

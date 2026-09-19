import express from "express";
import weaponsRouter from "./routes/weapons.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Serves front end files html , css, images and javascript
app.use(express.static("./public"));

// makes the weapon api and detail routes available.
app.use("/weapons", weaponsRouter);

// Runs if no route above matched.
app.use((req, res) => {
  res
    .status(404)
    .sendFile(new URL("./public/404.html", import.meta.url).pathname);
});

app.listen(PORT, () => {
  console.log(`⚔️ Dark Souls II sever running at http://localhost:${PORT}`);
});

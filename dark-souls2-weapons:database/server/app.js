import express from "express";
import { fileURLToPath } from "node:url";
import createWeaponsController from "./controllers/weapons.js";
import createWeaponsRouter from "./routes/weapons.js";

export function createApp(pool) {
  const app = express();
  const publicDirectory = fileURLToPath(new URL("./public/", import.meta.url));
  app.use(express.static(publicDirectory));
  app.use("/weapons", createWeaponsRouter(createWeaponsController(pool)));
  app.use((req, res) => {
    res.status(404).sendFile(
      fileURLToPath(new URL("./public/404.html", import.meta.url)),
    );
  });
  return app;
}

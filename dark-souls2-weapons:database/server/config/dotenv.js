import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Resolve server/.env from this file, not the terminal's working directory.
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

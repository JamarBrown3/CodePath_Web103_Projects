import { pool } from "./config/database.js";
import { createApp } from "./app.js";
const PORT = process.env.PORT || 3001;
const app = createApp(pool);

app.listen(PORT, () => {
  console.log(`⚔️ Dark Souls II server running at http://localhost:${PORT}`);
});

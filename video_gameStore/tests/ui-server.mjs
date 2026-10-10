// Isolated UI regression sandbox. No database, credentials, or real records.
// Run npm run test:ui and open the printed URL. Restart to reset fixtures.
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateGame, calculatePrice } from "../shared/gameRules.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let games = [{id:1,title:"Fixture One",image:"/images/BloodRayne.jpeg",genre:"Adventure",setting:"Fantasy",platform:"PC",player_mode:"Single-player",cover_color:"Blue",total_price:2000},
{id:2,title:"Fixture Two",image:"/images/BloodRayne.jpeg",genre:"RPG",setting:"Space",platform:"Console",player_mode:"Local co-op",cover_color:"Red",total_price:3500}];
let nextId = 3;
const server = await createServer({
  configFile:false, envDir:false, root:path.join(root,"client"),
  plugins:[react(), {name:"isolated-fixtures",configureServer(server) {
    server.middlewares.use(async (req,res,next) => {
      const match = req.url?.match(/^\/api\/games(?:\/(\d+))?$/);
      if (!match) return next();
      const id = Number(match[1]);
      const send = (status,data) => {res.statusCode=status;res.setHeader("Content-Type","application/json");res.end(JSON.stringify(data));};
      // Delay exposes loading/pending states; special fixture titles simulate failures.
      await new Promise(resolve=>setTimeout(resolve,150));
      if (req.method === "GET") return match[1] ? (games.find(g=>g.id===id) ? send(200,games.find(g=>g.id===id)) : send(404,{error:"Game not found."})) : send(200,games);
      if (req.method === "DELETE") {
        const found = games.find(g=>g.id===id);
        if (!found) return send(404,{error:"Game not found."});
        if (found.title === "FAIL DELETE") return send(500,{error:"Simulated delete failure."});
        games = games.filter(g=>g.id!==id);
        return send(200,found);
      }
      try {
        let body = ""; for await (const chunk of req) body += chunk;
        const value = JSON.parse(body);
        const error = validateGame(value);
        if (error) return send(400,{error});
        if (value.title === "FAIL SAVE") return send(500,{error:"Simulated save failure."});
        if (req.method === "PATCH" && !games.some(g=>g.id===id)) return send(404,{error:"Game not found."});
        const saved = {...value,id:req.method==="POST"?nextId++:id,total_price:calculatePrice(value)};
        if (req.method === "POST") games.push(saved);
        else games = games.map(g=>g.id===id?saved:g);
        return send(req.method==="POST"?201:200,saved);
      } catch { return send(400,{error:"Invalid JSON."}); }
    });
  }}],
  resolve:{alias:{picocss:path.join(root,"node_modules/@picocss/pico/css")}},
  server:{host:"127.0.0.1",port:5175,strictPort:true},
});
await server.listen();
server.printUrls();

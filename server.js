const express = require("express");
const server = express();
// ta emot json i request body
server.use(express.json());

// middleware (exempel på hur detta med "use" fungerar, som i server.use)
server.use((request, response, next) => {
  request.hello = "world";
  response.header("X-goodbye", "cruel world");
  next();
});

// lägg till session-hantering
session = require("express-session");
server.use(
  session({
    secret: ".l,rtkdyfhgs.xdsdalkrdfgkcdhmsrfkx", // för att salta våra session ids
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // vi SKA använda secure cookies i produktion, MEN INTE i dev
  })
);

// starta servern
server.listen(3000, () => {
  console.log("server started at http://localhost:3000/data");
});

// data
const util = require("util");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database/auctionista.db");
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

const req = require("express/lib/request");

// GET  (read, select) all bids
server.get("/data/bud", async (request, response) => {
  let query =
    "SELECT bud.objekt_id, objekt.titel, anvandare.anvandarnamn AS budgivare, bud.bud_pris ||' SEK' AS bud_pris, bud.bud_tid, status.status FROM bud, anvandare, objekt, status WHERE bud.bud_givare = anvandare.id AND bud.objekt_id = objekt.id AND objekt.status = status.id";
  let result = await db.all(query);
  response.json(result);
});

// GET (read, select) bids on one item
// http://localhost:3000/data/bud/1
server.get("/data/bud/:objekt_id", async (request, response) => {
  // request.params.objekt_id === 1

  let query =
    "SELECT bud.objekt_id, objekt.titel, anvandare.anvandarnamn AS budgivare, bud.bud_pris ||' SEK' AS bud_pris, bud.bud_tid, status.status FROM bud, anvandare, objekt, status WHERE bud.bud_givare = anvandare.id AND bud.objekt_id = objekt.id AND objekt.status = status.id AND bud.objekt_id = ?";
  let result = await db.all(query, [request.params.objekt_id]);
  response.json(result);
});

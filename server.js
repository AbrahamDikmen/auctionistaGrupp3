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

server.get("/data/:anvandare/antal_kopta_objekt", async (request, response) => {
  let query =
    "SELECT anvandare.anvandarnamn, bud.bud_givare, COUNT (objekt.titel) FROM anvandare, bud, objekt WHERE anvandare.id = ? AND bud.bud_givare = anvandare.id AND bud.objekt_id = objekt.id AND (objekt.status = 2 OR objekt.status = 3) AND bud.bud_pris = (SELECT MAX(bud_pris) FROM bud WHERE objekt.id = bud.objekt_id)";
  let result = await db.all(query, [request.params.anvandare]);
  response.json(result);
});

server.get("/data/:anvandare/antal_salda_objekt", async (request, response) => {
  let query =
    "SELECT anvandare.anvandarnamn, COUNT (objekt.titel) FROM anvandare, objekt WHERE anvandare.id = ? AND objekt.saljare = anvandare.id AND (objekt.status = 2 OR objekt.status = 3)";
  let result = await db.all(query, [request.params.anvandare]);
  response.json(result);
});

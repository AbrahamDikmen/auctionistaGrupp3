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
  console.log("server started at http://localhost:3000/auctionista/objekt");
});

const util = require("util");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database/auctionista.db");
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

// GET (read, select) all
server.get("/auctionista/objekt", async (request, response) => {
  let query =
    "SELECT id, dold_slutpris, start_pris FROM objekt WHERE objekt.id = ? AND dold_slutpris = ? AND start_pris = ?";

  await db.run(query, [
    request.body.id,
    request.body.dold_slutpris,
    request.body.start_pris,
  ]);

  if (request.body.dold_slutpris < request.start_pris) {
    response.json({ response: "worked" });
  } else {
    response.json({ response: "not worked" });
  }
});

// GET (read, select) one item

// POST (create, insert)
server.post("/auctionista/objekt/bud", async (request, response) => {
  if (request.body.start_pris > request.body.dold_slutpris) {
    let query = "SELECT start_pris, dold_slutpris FROM objekt WHERE id = ?";

    await db.run(query, [
      request.body.objekt.id,
      request.body.start_pris,
      request.body.dold_slutpris,
    ]);
    response.json({ result: "Auction sold" });
  } else {
    response.json({ result: "not sold" });
  }
});

// PUT (update, update)
server.put("/auctionista/objekt", async (request, response) => {
  if (request.body.start_pris > request.body.dold_slutpris) {
    let query = "SELECT start_pris, dold_slutpris FROM objekt WHERE id = ?";

    await db.run(query, [
      request.body.objekt.id,
      request.body.start_pris,
      request.body.dold_slutpris,
    ]);
    response.json({ result: "Auction sold" });
  } else {
    response.json({ result: "not sold" });
  }
});

// DELETE (delete, delete)
server.delete("/menu-items/:id", async (request, response) => {
  let query = "DELETE FROM menuitems WHERE id = ?";
  await db.run(query, [request.params.id]);
  response.json({ result: "One row delete" });
});

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

//Som besökare vill jag kunna se sammanfattade auktionsobjekt som en lista. / J&M
server.get("/data/objekt/summary-list", async (request, response) => {
  let query = "SELECT titel, start_pris, bild FROM objekt";
  let result = await db.all(query);
  response.json(result);
});
//Som besökare vill jag kunna se detaljer för varje auktionsobjekt. / J&M
server.get("/data/objekt/details", async (request, response) => {
  let query =
    "SELECT anvandare.anvandarnamn, objekt.saljare, objekt.beskrivning, objekt.titel, objekt.kategori, objekt.start_tid, objekt.slut_tid, objekt.bild, objekt.start_pris, objekt.status FROM objekt,anvandare WHERE anvandare.id = objekt.saljare";
  let result = await db.all(query);
  response.json(result);
});
//Som besökare vill jag kunna se nuvarande bud på auktionsobjekt i listvyer / J&M
server.get("/data/objekt/bid-list", async (request, response) => {
  let query =
    "SELECT titel, bud_pris FROM objekt, bud WHERE objekt.id = bud.id;";
  let result = await db.all(query);
  response.json(result);
});

server.post("/data/login", async (request, response) => {
  let query = await db.all(
    "SELECT id, anvandarnamn, losenord FROM Anvandare WHERE anvandarnamn = ? AND losenord = ?",
    [request.body.anvandarnamn, request.body.losenord]
  );

  /*
    OM query arrayn är större än 0
    Lägg till Användaren i session 
    skicka tillbaka användaren
  */

  if (query.length > 0) {
    request.session.query = query[0];
    response.json(query[0]);
    return;
  } else {
    response.json({ status: "Wrong Username/Password" });
  }
});

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


server.post("/data/login", async (request, response) => {

  let query = await db.all(
    "SELECT id, anvandarnamn, losenord FROM Anvandare WHERE anvandarnamn = ? AND losenord = ?",
    [request.body.anvandarnamn, request.body.losenord]
  )

  /*
    OM query arrayn är större än 0
    Lägg till Användaren i session 
    skicka tillbaka användaren
  */
  
  if (query.length > 0) {
    request.session.query = query[0]
    response.json(query[0])
    return;
  } else {
    response.json({ "status": "Wrong Username/Password"})
  }
})


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

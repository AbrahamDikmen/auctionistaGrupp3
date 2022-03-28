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
// Antonio was hereS
// Jennie is best

//3.
server.get("/data/search/:string", async (request, response) => {
  let query = `SELECT * FROM  objekt WHERE INSTR(LOWER(objekt.titel), LOWER(?))>0 OR INSTR(LOWER(objekt.beskrivning), LOWER(?))>0`;
  let result = await db.all(query, request.params.string, request.params.string);
  response.json(result);
});

//8.10.
server.post('/data/bud', async (req, res) => {
  let query = `SELECT * FROM bud WHERE bud.objekt_id = ? ORDER BY id DESC LIMIT 1`;
  let currentBid = (await db.all(query, req.body.objekt_id))[0];

  query = `SELECT saljare, status.status, pris FROM objekt,status WHERE objekt.id = ? AND objekt.status = status.id`;
  let object = (await db.all(query, req.body.objekt_id))[0];

  console.log(currentBid)
  console.log(object)
  console.log(req.body)

  if (currentBid && req.body.bud_pris <= currentBid.bud_pris
    || req.body.bud_givare === object.saljare
    || object.status != 'pågående'
    || !currentBid && req.body.bud_pris <= object.pris)
    res.json({ bidCreated: false });
  else {
    query = `INSERT INTO bud (objekt_id, bud_pris, bud_givare, bud_tid) VALUES(?,?,?,?)`;
    await db.run(query, [req.body.objekt_id, req.body.bud_pris, req.body.bud_givare, req.body.bud_tid]);
    res.json({ bidCreated: true })
  }
})

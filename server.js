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

// lista av användare
server.get('/data/anvandare', async (request, response)=>{
    let query = "SELECT * FROM anvandare"
    let result = await db.all(query)
    response.json(result)
     
  })
   // regestrera användare 
   server.post('/data/anvandare', async (request, response)=>{
    let query = `INSERT INTO anvandare 
    (namn, efternamn, anvandarnamn, losenord, telefonnummer, adress, postkod, ort, mail, bild) 
      VALUES (?,?,?,?,?,?,?,?,?,?)`
    await db.run(query, 
      [
        request.body.namn, 
        request.body.efternamn, 
        request.body.anvandarnamn, 
        request.body.telefonnummer, 
        request.body.adress,
        request.body.postkod, 
        request.body.ort, 
        request.body.mail, 
        request.body.bild])
    response.json({result: "A customer was added"})
  })
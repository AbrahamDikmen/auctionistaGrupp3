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
//Abraham was here

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

const util = require("util");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database/auctionista.db");
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

// GET (read, select) all
server.get("/auctionista/objekt", async (request, response) => {
  let query = "SELECT * FROM objekt";
  let result = await db.all(query);
  response.json(result);
});

// GET (read, select) one item

server.get("/auctionista/objekt/:id", async (request, response) => {
  let query = "SELECT * FROM objekt WHERE id = ?";
  let result = await db.all(query, [request.params.id]);
  response.json(result);

  // response.status(404)
  // response.json({error: "Not found"})
});

// POST (create, insert)
server.post("/auctionista/objekt", async (request, response) => {
  let query = "INSERT INTO objekt (saljare, dold_slutpris) VALUES (?, ?);";
  await db.run(query, [request.body.saljare, request.body.pris]);
  response.json({ result: "One row created" });
});

// PUT (update, update)
server.put("/auctionista/objekt:id", async (request, response) => {
  let query = "UPDATE menuitems SET name = ?, price = ? WHERE id = ?";
  await db.run(query, [
    request.body.name,
    request.body.price,
    request.params.id,
  ]);
  response.json({ result: "One row updated" });
});

// DELETE (delete, delete)
server.delete("/menu-items/:id", async (request, response) => {
  let query = "DELETE FROM menuitems WHERE id = ?";
  await db.run(query, [request.params.id]);
  response.json({ result: "One row delete" });
});

server.post("/data/login", async (request, response) => {
  let query = "SELECT * FROM customers WHERE email = ? AND password = ?";
  let result = await db.all(query, [request.body.email, request.body.password]);
  if (result.length > 0) {
    request.session.customer = result[0];
    response.json({ loggedIn: true });
  } else {
    delete request.session.customer;
    response.json({ loggedIn: false });
  }
});

server.get("/data/login", async (request, response) => {
  if (request.session.customer) {
    let query = "SELECT * FROM customers WHERE email = ? AND password = ?";
    let result = await db.all(query, [
      request.session.customer.email,
      request.session.customer.password,
    ]);

    if (result.length > 0) {
      response.json({
        firstname: request.session.customer.firstname,
        lastname: request.session.customer.lastname,
        email: request.session.customer.email,
      });
    } else {
      response.json({ loggedIn: false });
    }
  } else {
    response.json({ loggedIn: false });
  }
});

server.delete("/data/login", async (request, response) => {
  delete request.session.customer;
  response.json({ loggedIn: false });
});

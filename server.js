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
  console.log("server started at http://localhost:3000");
});

// data
const util = require("util");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database/auctionista.db");
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

const req = require("express/lib/request");

// 1. Som besökare vill jag kunna se sammanfattade auktionsobjekt som en lista. / J&M
server.get("/data/objekt/summary-list", async (request, response) => {
  let query = "SELECT titel, start_pris, bild FROM objekt";
  let result = await db.all(query);
  response.json(result);
});

// 2. Som besökare vill jag kunna se detaljer för varje auktionsobjekt. / J&M
server.get("/data/objekt/details", async (request, response) => {
  let query =
    "SELECT anvandare.anvandarnamn, objekt.saljare, objekt.beskrivning, objekt.titel, objekt.kategori, objekt.start_tid, objekt.slut_tid, objekt.bild, objekt.start_pris, objekt.status FROM objekt,anvandare WHERE anvandare.id = objekt.saljare";
  let result = await db.all(query);
  response.json(result);
});

//3. Som besökare vill jag kunna söka på auktioner baserat på vad jag skriver i ett sökfält.
server.get("/data/search/:string", async (request, response) => {
  let query = `SELECT * FROM  objekt WHERE INSTR(LOWER(objekt.titel), LOWER(?))>0 OR INSTR(LOWER(objekt.beskrivning), LOWER(?))>0`;
  let result = await db.all(
    query,
    request.params.string,
    request.params.string
  );
  response.json(result);
});

// 4. Som besökare vill jag kunna se nuvarande bud på auktionsobjekt i listvyer / J&M
server.get("/data/objekt/bid-list", async (request, response) => {
  let query =
    "SELECT titel, bud_pris FROM objekt, bud WHERE objekt.id = bud.id;";
  let result = await db.all(query);
  response.json(result);
});

// Alla bud
server.get("/data/bud", async (request, response) => {
  let query =
    "SELECT bud.objekt_id, objekt.titel, anvandare.anvandarnamn AS budgivare, bud.bud_pris ||' SEK' AS bud_pris, bud.bud_tid, status.status FROM bud, anvandare, objekt, status WHERE bud.bud_givare = anvandare.id AND bud.objekt_id = objekt.id AND objekt.status = status.id";
  let result = await db.all(query);
  response.json(result);
});

// 5. Som besökare vill jag kunna se nuvarande bud på auktionsobjekt i detaljsidor.
// http://localhost:3000/data/bud/1
server.get("/data/bud/:objekt_id", async (request, response) => {
  // request.params.objekt_id === 1

  let query =
    "SELECT bud.objekt_id, objekt.titel, anvandare.anvandarnamn AS budgivare, bud.bud_pris ||' SEK' AS bud_pris, bud.bud_tid, status.status FROM bud, anvandare, objekt, status WHERE bud.bud_givare = anvandare.id AND bud.objekt_id = objekt.id AND objekt.status = status.id AND bud.objekt_id = ?";
  let result = await db.all(query, [request.params.objekt_id]);
  response.json(result);
});

// 6.Som besökare vill jag kunna registrera ett nytt konto och bli användare
server.post("/data/anvandare", async (request, response) => {
  let query = `INSERT INTO anvandare 
    (namn, efternamn, anvandarnamn, losenord, telefonnummer, adress, postkod, ort, mail, bild) 
      VALUES (?,?,?,?,?,?,?,?,?,?)`;
  await db.run(query, [
    request.body.namn,
    request.body.efternamn,
    request.body.anvandarnamn,
    request.body.telefonnummer,
    request.body.adress,
    request.body.postkod,
    request.body.ort,
    request.body.mail,
    request.body.bild,
  ]);
  response.json({ result: "A customer was added" });
});

// 7. Som användare vill jag kunna logga in.

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

//8.10.
server.post("/data/bud", async (req, res) => {
  let query = `SELECT * FROM bud WHERE bud.objekt_id = ? ORDER BY id DESC LIMIT 1`;
  let currentBid = (await db.all(query, req.body.objekt_id))[0];

  query = `SELECT saljare, status.status, pris FROM objekt,status WHERE objekt.id = ? AND objekt.status = status.id`;
  let object = (await db.all(query, req.body.objekt_id))[0];

  console.log(currentBid);
  console.log(object);
  console.log(req.body);

  if (
    (currentBid && req.body.bud_pris <= currentBid.bud_pris) ||
    req.body.bud_givare === object.saljare ||
    object.status != "pågående" ||
    (!currentBid && req.body.bud_pris <= object.pris)
  )
    res.json({ bidCreated: false });
  else {
    query = `INSERT INTO bud (objekt_id, bud_pris, bud_givare, bud_tid) VALUES(?,?,?,?)`;
    await db.run(query, [
      req.body.objekt_id,
      req.body.bud_pris,
      req.body.bud_givare,
      req.body.bud_tid,
    ]);
    res.json({ bidCreated: true });
  }
});

/*
9. Som användare vill jag kunna skapa nya auktionsobjekt.
11. Som användare vill jag att auktinsobjekt ska innehålla minst, titel,
beskrivning, starttid, sluttid och bilder.
12.Som användare vill jag kunna sätta ett utgångspris på mina auktionsobjekt.
*/

// Feature for new object

server.post("/data/new_auction_object", async (request, response) => {
  let query =
    "INSERT INTO objekt (saljare, beskrivning, titel, kategori, start_tid, slut_tid, bild, start_pris, dold_slutpris, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  await db.run(query, [
    request.body.saljare,
    request.body.beskrivning,
    request.body.titel,
    request.body.kategori,
    request.body.start_tid,
    request.body.slut_tid,
    request.body.bild,
    request.body.start_pris,
    request.body.dold_slutpris,
    request.body.status,
  ]);
  response.json({ result: "One new auction object was created" });
});

/* 
14.Som besökare vill jag kunna se auktioner inom kategorier.
15.Som besökare vill jag kunna söka på auktioner inom en kategori jag valt.
16.Som besökare vill jag kunna se auktioner baserat på status (pågående, avslutade, sålda, ej sålda). 
*/

// Feature filter by category (14 & 15)

//Code for filter by text
// Cykel
server.get("/data/category/cykel", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 1";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Mobil
server.get("/data/category/mobil", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 2";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Djur
server.get("/data/category/djur", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 3";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Bil
server.get("/data/category/bil", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 4";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Kläder & skor
server.get("/data/category/klader&skor", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 5";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Fiske
server.get("/data/category/fiske", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 6";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Sport
server.get("/data/category/sport", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 7";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Möbler
server.get("/data/category/mobler", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 8";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Verktyg
server.get("/data/category/verktyg", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 9";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Dator
server.get("/data/category/dator", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 10";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Teknik
server.get("/data/category/teknik", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 11";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Feature filter by status (16)

// Pågående
server.get("/data/status/ongoing", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE status = 1";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// avslutat- mottaget
server.get("/data/status/end_recived", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE status = 2";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// avslutat- skickat
server.get("/data/status/end_shipped", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE status = 3";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// avslutat- ej sålt
server.get("/data/status/end_not_sold", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE status = 4";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// Code for filter categories by categories ID and status ID number
// Must place after string categorys and string staus code for some reason.
server.get("/data/category/:id", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = ?";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

server.get("/data/status/:id", async (request, response) => {
  let query =
    "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE status = ?";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// 17.Som användare vill jag kunna se en lista med mina egna auktionsobjekt.
server.get("/data/mina-auktioner/:id", async (request, response) => {
  let query = `SELECT titel, kategorier.kategori, beskrivning
               FROM objekt
               JOIN kategorier ON objekt.kategori = kategorier.id
               JOIN anvandare ON objekt.saljare = anvandare.id
               WHERE anvandare.id = ? `;
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

server.get("/data/anvandare", async (request, response) => {
  let query = "SELECT * FROM anvandare";
  let result = await db.all(query);
  response.json(result);
});

// 18. Som användare vill jag kunna se en lista med auktionsobjekt jag har lagt bud på.

server.get("/data/:anvandare/mina_bud", async (request, response) => {
  let query =
    "SELECT anvandare.anvandarnamn, bud.bud_givare, objekt.id AS objekt_id, objekt.titel FROM anvandare, bud, objekt WHERE bud.bud_givare = anvandare.id AND objekt.id = bud.objekt_id AND anvandare.id = ?";
  let result = await db.all(query, [request.params.anvandare]);
  response.json(result);
});

//20.Som användare vill jag ha en publik profilsida där namn,
//publika kontaktuppgift(er) & bild visas för andra att läsa.
server.get("/data/anvandare/:id", async (request, response) => {
  let query =
    "SELECT bild, anvandarnamn, namn, mail FROM anvandare WHERE id = ?";
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});

// 22. Som köpare vill jag kunna ge ett betyg efter köp av ett auktionsobjekt.

server.post("/data/anvandare/betyg", async (request, response) => {
  let query =
    "INSERT INTO betyg (anvandare_id, betyg_givare, betyg) VALUES (?, ?, ?)";
  await db.run(query, [
    request.body.anvandare_id,
    request.body.betyg_givare,
    request.body.betyg,
  ]);
  response.json({ result: "Nytt betyg skapat" });
});

/*
25.Som användare vill jag kunna skicka meddelande till en säljare av ett auktionsobjekt.
26.Som säljare av ett auktionsobjekt vill jag kunna svara på meddelande från användare.
*/ 

// First contact message
// Creates the connection between two users.
server.post('/data/conversation/new_conversation', async (request, response)=>{
    let query = "INSERT INTO messages (sender, receiver, message, object) VALUES(?,?, CURRENT_DATE || ' ' || CURRENT_TIME || ':  ' || CHAR(13) || ?, ? )"
    await db.run(query, [
        request.body.sender,
        request.body.receiver,
        request.body.message,
        request.body.object])
    response.json({result: "Your message has been sent."})
})

// Reply messages
// Update the conversation with new messages in a already existing conversation.
server.put('/data/conversation/reply_:id', async (request, response)=>{
    let query = "UPDATE messages SET message = message || ' ' || CHAR(13) || CHAR(13) || CURRENT_DATE || ' ' || CURRENT_TIME || ':  ' || CHAR(13) || ? WHERE id = ?"
    await db.run(query, [
        request.body.message,
        request.params.id])
    response.json({result: "Your reply has been sent."})
})

// Read conversation
// A get for reading the conversation.
server.get('/data/conversation/:id', async (request, response)=>{
    let query = "SELECT message FROM messages WHERE id = ?"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// 24.Som användare vill jag kunna se säljares betyg när jag tittar på ett auktionsobjekt
server.get('/data/saljarens-betyg/:objektId', async (request, response)=>{
  let query = `SELECT titel, beskrivning, betyg.betyg 
                 FROM objekt
                 JOIN betyg ON objekt.saljare = betyg.anvandare_id
                 WHERE objekt.id = ?`
  let result = await db.all(query, [request.params.objektId])
  response.json(result)
})

/*
9. Som användare vill jag kunna skapa nya auktionsobjekt.
11. Som användare vill jag att auktinsobjekt ska innehålla minst, titel,
beskrivning, starttid, sluttid och bilder.
*/

server.post('/auction_object/new_auction_object', async (request, response)=>{
    let query = "INSERT INTO objekt (saljare, beskrivning, titel, kategori, start_tid, slut_tid, bild, start_pris, dold_slutpris, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    await db.run(query, [request.body.name, request.body.price])
    response.json({result: "One new auction object was created"})
})

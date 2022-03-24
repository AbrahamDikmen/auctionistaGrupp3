/*
9. Som användare vill jag kunna skapa nya auktionsobjekt.
11. Som användare vill jag att auktinsobjekt ska innehålla minst, titel,
beskrivning, starttid, sluttid och bilder.
*/

// Feature for new object

server.post('/data/new_auction_object', async (request, response)=>{
    let query = "INSERT INTO objekt (saljare, beskrivning, titel, kategori, start_tid, slut_tid, bild, start_pris, dold_slutpris, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    await db.run(query,
        [request.body.saljare,
        request.body.beskrivning,
        request.body.titel,
        request.body.start_tid,
        request.body.slut_tid,
        request.body.bild,
        request.body.start_pris,
        request.body.dold_slutpris,
        request.body.status])
    response.json({result: "One new auction object was created"})
})

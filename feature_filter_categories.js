/* 
14.Som besökare vill jag kunna se auktioner inom kategorier.
15.Som besökare vill jag kunna söka på auktioner inom en kategori jag valt.
16.Som besökare vill jag kunna se auktioner baserat på status (pågående, avslutade, sålda, ej sålda). 
*/

// Feature filter by category (14 & 15)

// Code for filter by ID number 
server.get('/auction_object/category/:id', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = ?"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

//Code for filter by text
// Cykel
server.get('/auction_object/category/cykel', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 1"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Mobil
server.get('/auction_object/category/mobil', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 2"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Djur
server.get('/auction_object/category/djur', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 3"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Bil
server.get('/auction_object/category/bil', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 4"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Kläder & skor
server.get('/auction_object/category/klader&skor', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 5"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Fiske
server.get('/auction_object/category/fiske', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 6"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Sport
server.get('/auction_object/category/sport', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 7"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Möbler
server.get('/auction_object/category/mobler', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 8"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Verktyg
server.get('/auction_object/category/verktyg', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 9"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Dator
server.get('/auction_object/category/dator', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 10"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})

// Teknik
server.get('/auction_object/category/teknik', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 11"
    let result = await db.all(query, [request.params.id])
    response.json(result)
})




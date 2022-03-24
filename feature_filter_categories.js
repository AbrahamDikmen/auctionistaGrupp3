/* 
14.Som besökare vill jag kunna se auktioner inom kategorier.
15.Som besökare vill jag kunna söka på auktioner inom en kategori jag valt.
16.Som besökare vill jag kunna se auktioner baserat på status (pågående, avslutade, sålda, ej sålda). 
*/

// Feature filter by category (14 & 15)

// Code for filter by ID number 
server.get('/data/category/:kategori', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = ?"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

//Code for filter by text
// Cykel
server.get('/data/category/cykel', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 1"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Mobil
server.get('/data/category/mobil', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 2"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Djur
server.get('/data/category/djur', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 3"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Bil
server.get('/data/category/bil', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 4"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Kläder & skor
server.get('/data/category/klader&skor', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 5"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Fiske
server.get('/data/category/fiske', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 6"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Sport
server.get('/data/category/sport', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 7"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Möbler
server.get('/data/category/mobler', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 8"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Verktyg
server.get('/data/category/verktyg', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 9"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Dator
server.get('/data/category/dator', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 10"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})

// Teknik
server.get('/data/category/teknik', async (request, response)=>{

    let query = "SELECT titel, beskrivning, start_tid, slut_tid, bild, start_pris FROM objekt WHERE kategori = 11"
    let result = await db.all(query, [request.params.kategori])
    response.json(result)
})




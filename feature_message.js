



// POST (create, insert)
server.post('/data/menu-items', async (request, response)=>{
    let query = "INSERT INTO menuitems (name, price) VALUES(?,?)"
    await db.run(query, [request.body.name, request.body.price])
    response.json({result: "One row created"})
})

// PUT (update, update)
server.put('/data/menu-items/:id', async (request, response)=>{
    let query = "UPDATE menuitems SET name = ?, price = ? WHERE id = ?"
    await db.run(query, [request.body.name, request.body.price, request.params.id])
    response.json({result: "One row updated"})
})
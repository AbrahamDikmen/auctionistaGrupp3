



// First contact message
// Creates the connection between two users.
server.post('/data/conversation/new_conversation', async (request, response)=>{
    let query = "INSERT INTO messages (sender, reciver, message, object) VALUES(?,?, CURRENT_DATE || ' ' || CURRENT_TIME || ':  ' || CHAR(13) || ?, ? )"
    await db.run(query, [request.body.sender, request.body.reciver, request.body.message, request.body.object])
    response.json({result: "Your message has been sent."})
})

// Reply messages
// Update the conversation with new messages in a already existing conversation.
server.put('/data/conversation/:id', async (request, response)=>{
    let query = "UPDATE messages SET message = message || ' ' || CHAR(13) || CHAR(13) || CURRENT_DATE || ' ' || CURRENT_TIME || ':  ' || CHAR(13) || ? WHERE id = ?"
    await db.run(query, [request.body.message, request.params.id])
    response.json({result: "Your reply has been sent."})
})
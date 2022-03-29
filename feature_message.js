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
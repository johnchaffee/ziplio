require("dotenv").config()
const path = require("path")
const express = require("express")
const PORT = process.env.PORT || 3001
const app = express()
const db = require("./database")
const limit = 10

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import and use routes
const webhooksRouter = require("./routes/webhooks")
app.use("/twilio-webhook", webhooksRouter)

app.get("/conversations", (req, res) => {
  console.log("/CONVERSATIONS")

  async function getConversations() {
    console.log("getConversations():")
    try {
      const result = await db.pool.query(
        "SELECT * FROM conversations WHERE status = 'open' order by date_updated desc limit $1",
        [limit]
      )
      conversations = result.rows
      conversations.forEach((conversation) => {
        conversation.type = "conversationUpdated"
      })
      res.json(conversations)
    } catch (err) {
      console.log("getConversations() CATCH")
      console.error(err)
    }
  }
  getConversations("+12063996576").then(function () {
    console.log("GET CONVERSATIONS .THEN")
  })
})

app.get("/messages", (req, res) => {
  console.log("/MESSAGES")

  async function getMessages(mobileNumberQuery) {
    console.log("getMessages():")
    try {
      const result = await db.pool.query(
        "SELECT * FROM messages WHERE mobile_number = $1 order by date_created desc limit $2",
        [mobileNumberQuery, limit]
      )

      messages = result.rows.reverse()
      messages.forEach((message) => {
        message.type = "messageCreated"
      })
      res.json(messages)
    } catch (err) {
      console.error(err)
      res.send("Error " + err)
    }
  }
  getMessages("+12063996576").then(function () {
    console.log("GET MESSAGES .THEN")
  })
})

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  console.log("* CATCHALL")
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

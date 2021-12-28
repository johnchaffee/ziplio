require("dotenv").config()
const path = require("path")
const express = require("express")
const PORT = process.env.PORT || 3001
const app = express()
const db = require("./database")

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import and use routes
const webhooksRouter = require("./routes/webhooks")
app.use("/twilio-webhook", webhooksRouter)
const messagesendRouter = require("./routes/messages")
app.use("/messages", messagesendRouter)
const conversationsRouter = require("./routes/conversations")
app.use("/conversations", conversationsRouter)

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  console.log("* CATCHALL")
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

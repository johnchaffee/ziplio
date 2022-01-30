require("dotenv").config()
const WebSocket = require("ws")
const WebSocketServer = WebSocket.Server
const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 3001

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

// ACK ZIPWHIP WEBHOOKS
// Ack Zipwhip Webhooks that are received on this server
app.post(/\/(receive|progress|send|stop|comm)/, (req, res, next) => {
  console.log("ACK ZIPWHIP WEBHOOK");
  res.sendStatus(200);
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  console.log("* CATCHALL")
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
})

// EXPRESS SERVER
const server = app.listen(port, function () {
  console.log(`Express server listening on port ${port}`)
})

// WEBSOCKET SERVER
// The Websocket server is running on this node server
const wsServer = new WebSocketServer({ server: server })

function noop() {}

function heartbeat() {
  this.isAlive = true
}

// SERVER PING
// Ping client every 45 seconds to keep connection alive
const interval = setInterval(function ping() {
  console.log("SERVER PING")
  wsServer.clients.forEach(function each(socketClient) {
    if (socketClient.isAlive === false) return socketClient.terminate()

    socketClient.isAlive = false
    socketClient.ping(noop)
  })
}, 45000)

// ON CONNECTION
// New client websocket connection
wsServer.on("connection", (socketClient) => {
  console.log("ON CONNECTION")
  console.log("Number of clients: ", wsServer.clients.size)
  socketClient.isAlive = true
  socketClient.on("pong", heartbeat)

  // ON MESSAGE
  // This is triggered by the client.updateWebsocketClient() function, it sends a single item array
  // containing either a messageCreated or conversationUpdated object to each connected client
  socketClient.on("message", (message) => {
    console.log("socketClient.on(message)")
    console.log(message)
    let messageObject = JSON.parse(message)
    console.log("forEach => client.send()")
    wsServer.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        JSON.stringify(message).length > 2
      ) {
        client.send(JSON.stringify([messageObject]))
      }
    })
  })

  // ON CLOSE
  // Log when connection is closed
  socketClient.on("close", (socketClient) => {
    console.log("ON CLOSE")
    // clearInterval(interval);
    console.log("Number of clients: ", wsServer.clients.size)
  })
})

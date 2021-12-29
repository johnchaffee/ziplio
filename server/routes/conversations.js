require("dotenv").config()
const express = require("express")
const router = express.Router()
const db = require("../database")
const limit = process.env.LIMIT

const app_host_name = process.env.APP_HOST_NAME || "localhost"
const ngrok_url = process.env.NGROK_URL
let status_callback_url = ""
if (process.env.NODE_ENV === "development") {
  status_callback_url = `https://${ngrok_url}/twilio-webhook`
} else {
  status_callback_url = `https://${app_host_name}.herokuapp.com/twilio-webhook`
}

let twilio_number = ""

router.get("/", (req, res) => {
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

// CREATE CONVERSATION
// Triggered when client clicks + button and creates a new conversation
router.post("/", (req, res, next) => {
  twilioNumber(req.body.mobile_number)
  console.log("CREATE CONVERSATION")
  conversationObject = {
    type: "conversationUpdated",
    date_updated: new Date().toISOString(),
    conversation_id: `${twilio_number};${req.body.mobile_number}`,
    unread_count: 0,
    status: "open",
  }
  db.updateConversation(conversationObject)
  res.sendStatus(200)
})

// NAME OR ARCHIVE A CONVERSATION
// Triggered when client edits contact_name or archives a conversation
router.put("/", (req, res, next) => {
  console.log("UPDATE CONVERSATION")
  console.log(req.body)
  twilio_number = process.env.TWILIO_NUMBER
  console.log(`TWILIO NUMBER BEFORE: ${twilio_number}`)
  twilioNumber(req.body.mobile_number)
  console.log(`TWILIO NUMBER AFTER: ${twilio_number}`)
  // Set contact_name
  if (req.body.contact_name != null) {
    conversationObject = {
      type: "conversationContactUpdated",
      conversation_id: `${twilio_number};${req.body.mobile_number}`,
      contact_name: req.body.contact_name,
      status: "open",
    }
    console.log(conversationObject)
    db.nameConversation(conversationObject)
    // client.updateWebsocketClient(conversationObject)
  } else if (req.body.status != null) {
    conversationObject = {
      type: "conversationStatusUpdated",
      conversation_id: `${twilio_number};${req.body.mobile_number}`,
      status: req.body.status,
    }
    if (req.body.status === "deleted") {
      // Delete all associated messages
      db.deleteMessages(conversationObject)
    }
    db.archiveConversation(conversationObject)
    // client.updateWebsocketClient(conversationObject)
  }
  // db.updateConversation(conversationObject);
  res.sendStatus(200)
})

// Match twilio number to mobile channel
function twilioNumber(mobile_number) {
  console.log("twilioNumber()")
  if (mobile_number.slice(0, 9) === "messenger") {
    twilio_number = process.env.FACEBOOK_MESSENGER_ID
  } else if (mobile_number.slice(0, 8) === "whatsapp") {
    twilio_number = process.env.WHATSAPP_ID
  } else {
    twilio_number = process.env.TWILIO_NUMBER
  }
}

module.exports = router

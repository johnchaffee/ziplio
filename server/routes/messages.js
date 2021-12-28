require("dotenv").config()
const express = require("express")
const router = express.Router()
const db = require("../database")
const axios = require("axios").default
const qs = require('qs');
const limit = 10

const app_host_name = process.env.APP_HOST_NAME || "localhost"
const ngrok_url = process.env.NGROK_URL
let status_callback_url = ""
if (process.env.NODE_ENV === "development") {
  status_callback_url = `https://${ngrok_url}/twilio-webhook`
} else {
  status_callback_url = `https://${app_host_name}.herokuapp.com/twilio-webhook`
}

let twilio_number = ""
const twilio_account_sid = process.env.TWILIO_ACCOUNT_SID
const twilio_auth_token = process.env.TWILIO_AUTH_TOKEN
const auth_header =
  "Basic " +
  Buffer.from(twilio_account_sid + ":" + twilio_auth_token).toString("base64")

  router.get("/", (req, res) => {
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

// SEND OUTGOING MESSAGE
// Web client posts '/messages' request to this server, which posts request to Twilio API
router.post("/", (req, res, next) => {
  console.log("/messages")
  let body = req.body.body
  let mobile_number = req.body.mobile_number
  let media_url = req.body.media_url
  if (mobile_number.slice(0, 9) === "messenger") {
    // If sending to messenger, send from facebook_messenger_id
    twilio_number = process.env.FACEBOOK_MESSENGER_ID
  } else if (mobile_number.slice(0, 8) === "whatsapp") {
    // If sending to whatsapp, send from whats_app_id
    twilio_number = process.env.WHATSAPP_ID
  } else {
    // else, send from twilio SMS number
    twilio_number = process.env.TWILIO_NUMBER
  }
  // Send message via Twilio API
  const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilio_account_sid}/Messages.json`
  // url encode body params
  let bodyParams = {
    From: twilio_number,
    To: mobile_number,
    Body: body,
    StatusCallback: status_callback_url
  }
  console.log("BODY PARAMS: ", bodyParams)
  if (media_url !== undefined && media_url !== null) {
    bodyParams.MediaUrl = media_url
    console.log("MEDIA URL PARAMS: ", bodyParams)
    }
  bodyParams = qs.stringify(bodyParams)
  console.log("QS.STRINGIFY BODY PARAMS: ", bodyParams)
  const config = {
    method: 'post',
    url: apiUrl,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      Authorization: auth_header
    },
    data : bodyParams
  }
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error);
  })
  // res.sendStatus(200);
})

module.exports = router

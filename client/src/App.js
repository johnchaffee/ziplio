import axios from "axios"
import React, { useEffect, useState } from "react"
import "./App.css"
import SendMessage from "./SendMessage"
import Messages from "./Messages"
import Conversations from "./Conversations"
import ConversationButtons from "./ConversationButtons"

export default function App() {
  console.log("RENDER APP")

  // MESSAGES STATE
  const [messagesList, setMessagesList] = useState()
  console.log("Render App messagesList: \n", messagesList)

  // ASYNC AXIOS GET MESSAGES
  useEffect(() => {
    async function getMessages() {
      // On first load fetch all the messages and set messagesList array
      const response = await axios.get(`/messages?mobile=${mobileNumber}`)
      setMessagesList(response.data)
    }
    getMessages()
  }, [])

  // CONVERSATIONS STATE
  const [conversationsList, setConversationsList] = useState(null)
  console.log("Render App conversationsList: \n", conversationsList)

  // ASYNC AXIOS GET CONVERSATIONS
  useEffect(() => {
    async function getConversations() {
      const response = await axios.get("/conversations")
      setConversationsList(response.data)
    }
    getConversations()
  }, [])

  // MESSAGE RECEIVED FROM SERVER ->
  wsClient.onmessage = (event) => {
    const messages = JSON.parse(event.data)
    console.log("CLIENT ONMESSAGE")
    console.log(messages)
    console.log("messages.length: ", messages.length)
    console.log("messages[0].type: ", messages[0].type)
    // Play Audio for incoming and outgoing messages
    if (messages.length === 1 && messages[0].type === "messageCreated") {
      const now = Date.parse(new Date())
      const delivered = Date.parse(messages[0].date_created)
      const inboundAudio = new Audio("/inboundAudio.mp3")
      const outboundAudio = new Audio("/outboundAudio.mp3")
      // Only play a sound for new messages delivered within last 2 seconds
      if (now - delivered < 2000) {
        if (messages[0].direction === "inbound") {
          inboundAudio.play()
        } else if (messages[0].direction === "outbound") {
          outboundAudio.play()
        }
      }
    }
    if (messages.length > 0) {
      messages.forEach((thisMessage) => {
        // If type is messagecreated and matches selected conversation, render message
        console.log("thisMessage.type: ", thisMessage.type)
        console.log("thisMessage.mobile_number: ", thisMessage.mobile_number)
        console.log(`mobileNumber:${mobileNumber}`)
        if (
          thisMessage.type === "messageCreated" &&
          thisMessage.mobile_number === mobileNumber
        ) {
          console.log("APPEND MESSAGE")
          console.log("THIS MESSAGE: ", thisMessage)
          console.log("MESSAGE LIST: ", messagesList)
          setMessagesList([...messagesList, thisMessage])
        }
      })
      // If first array type is conversationSomething, update conversationList and re-render conversation list
      if (
        messages[0].type !== undefined &&
        messages[0].type.startsWith("conversation")
      ) {
        // renderConversationList(messages)
        console.log("RENDER CONVERSATION LIST")
        console.log("MESSAGES[0]: ", messages[0])
        let updateConversationList = conversationsList.filter(
          (conversation) => conversation.id !== messages[0].id
        )
        // If conversation was archived, don't add it back to array
        if (messages[0].type !== "conversationArchived") {
          updateConversationList.push(messages[0])
        }
        updateConversationList
          .sort((a, b) => a.date_updated.localeCompare(b.date_updated))
          .reverse()
        console.log("UPDATE CONVERSATION LIST: ", updateConversationList)
        setConversationsList(updateConversationList)
      }
    } else {
      console.log("EMPTY MESSAGE, DO NOTHING")
      console.log(messages.length)
    }
  }

  if (!messagesList) return null
  if (!conversationsList) return null

  return (
    <>
      <div id="container">
        <Conversations conversationsList={conversationsList} />
        <div id="messages" className="column">
          <ConversationButtons />
          <Messages messagesList={messagesList} />
          <SendMessage />
        </div>
      </div>
    </>
  )
}

const urlParams = new URLSearchParams(window.location.search)
console.log(`urlParams: ${urlParams}`)
const mobileParam = urlParams.get("mobile") || ""
console.log(`mobileParam: ${mobileParam}`)
// const mobileParamEncoded = encodeURIComponent(urlParams.get("mobile")) // %2B12065551111
// console.log(`mobileParamEncoded: ${mobileParamEncoded}`)
// const mobileParamDecoded = decodeURIComponent(mobileParam) // +12065551111
// console.log(`mobileParamDecoded: ${mobileParamDecoded}`)
// let mobile_number = mobileParamDecoded
// console.log(`URL PARAM MOBILE NUMBER: ${mobile_number}`)
console.log("REPLACE SPACE WITH +: ", mobileParam.replace(" ", "+"))
export const mobileNumber = mobileParam.replace(" ", "+")
console.log(`mobileNumber: ${mobileNumber}`)

const host = window.location.origin
console.log(`HOST: ${host}`)

let wsHost
if (process.env.NODE_ENV === "development") {
  wsHost = host.replace(/^http/, "ws").replace("3000", "3001")
} else {
  wsHost = host.replace(/^http/, "ws")
}
console.log(`WSHOST: ${wsHost}`)

const wsClient = new WebSocket(wsHost)

wsClient.onopen = () => {
  console.log("ON CONNECTION")
  console.log("Websocket connected to: " + wsClient.url)
  // Do nothing
}

wsClient.onclose = () => {
  console.log("ON CLOSE")
}

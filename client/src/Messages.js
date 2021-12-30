import axios from "axios"
import React, { useEffect, useState } from "react"
import { mobileNumber, wsClient } from './App'

export default function Messages() {
  // console.log("MESSAGES LIST: ", messagesList)
  console.log("RENDER MESSAGES")

  // MESSAGES STATE
  const [messagesList, setMessagesList] = useState()
  console.log("messagesList: \n", messagesList)

  // ASYNC AXIOS GET MESSAGES
  useEffect(() => {
    async function getMessages() {
      // On first load fetch all the messages and set messagesList array
      const response = await axios.get(`/messages?mobile=${mobileNumber}`)
      setMessagesList(response.data)
    }
    getMessages()
  }, [])

  // MESSAGE RECEIVED FROM SERVER ->
  wsClient.onmessage = (event) => {
    const messages = JSON.parse(event.data)
    console.log("CLIENT ON MESSAGE")
    console.log(messages)
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
    } else {
      console.log("EMPTY MESSAGE, DO NOTHING")
      console.log(messages.length)
    }
  }

  if (!messagesList) return null

  return (
    <div>
      {messagesList.map((message) => (
        <p key={message.id}>{message.body}</p>
      ))}
    </div>
  )
}

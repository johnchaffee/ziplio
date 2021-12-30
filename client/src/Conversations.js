import axios from "axios"
import React, { useEffect, useState } from "react"
import { mobileNumber, wsClient } from './App'

export default function Conversations() {
  console.log("RENDER CONVERSATIONS")

  // CONVERSATIONS STATE
  const [conversationsList, setConversationsList] = useState(null)
  console.log("conversationsList: \n", conversationsList)

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
    console.log("CLIENT ON MESSAGE")
    console.log(messages)
    // Play Audio for incoming and outgoing messages
    if (
      messages.length > 0 &&
      messages[0].type !== undefined &&
      messages[0].type.startsWith("conversation")
    ) {
      // If first array type is conversationSomething, update conversationList and re-render conversation list
      console.log("MESSAGES[0]: ", messages[0])
      let updateConversationList = conversationsList.filter(
        (conversation) => conversation.id !== messages[0].id
      )
      updateConversationList.unshift(messages[0])
      console.log("UPDATE CONVERSATION LIST: ", updateConversationList)
      setConversationsList(updateConversationList)
    } else {
      console.log("EMPTY MESSAGE, DO NOTHING")
      console.log(messages.length)
    }
  }

  if (!conversationsList) return null

  return (
    <div>
      {conversationsList.map((conversation) => (
        <p key={conversation.id}>
          {conversation.contact_name}: {conversation.conversation_id.split(";")[1]}
        </p>
      ))}
    </div>
  )
}

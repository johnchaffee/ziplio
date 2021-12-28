import axios from "axios"
import React, { useEffect, useState } from "react"
import "./App.css"
import SendMessage from "./SendMessage"
import Messages from "./Messages"
import Conversations from "./Conversations"

function App() {
  console.log("RENDER APP")

  // MESSAGES STATE
  const [messages, setMessages] = useState(null)
  console.log("messages: \n", messages)

  // ASYNC AXIOS GET MESSAGES
  useEffect(() => {
    async function getMessages() {
      const response = await axios.get("/messages")
      setMessages(response.data)
    }
    getMessages()
  }, [])

  // CONVERSATIONS STATE
  const [conversations, setConversations] = useState(null)
  console.log("conversations: \n", conversations)

  // ASYNC AXIOS GET CONVERSATIONS
  useEffect(() => {
    async function getConversations() {
      const response = await axios.get("/conversations")
      setConversations(response.data)
    }
    getConversations()
  }, [])

  if (!messages) return null
  if (!conversations) return null

  return (
    <>
      <div className="App">
        <h2>SendMessage</h2>
        <SendMessage />
        <h2>Conversations</h2>
        <Conversations conversations={conversations} />
        <h2>Messages</h2>
        <Messages messages={messages} />
      </div>
    </>
  )
}

export default App

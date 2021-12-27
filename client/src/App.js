import axios from "axios"
import React, { useEffect, useState } from "react"
import "./App.css"
import Messages from "./Messages"
import Conversations from "./Conversations"

function App() {
  console.log("RENDER APP")

  function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // MESSAGES STATE
  const [messages, setMessages] = useState(null)
  console.log("messages: \n", messages)

  // ASYNC AXIOS GET MESSAGES
  useEffect(() => {
    async function getMessages() {
      const response = await axios.get("/messages")
      // setMessages(response.data)
      setMessages(response.data.slice(0, getRandomNum(1, 10)))
    }
    // getMessages(4)
    setInterval(function () {
      getMessages()
    }, 2000)
  }, [])

  // CONVERSATIONS STATE
  const [conversations, setConversations] = useState(null)
  console.log("conversations: \n", conversations)

  // ASYNC AXIOS GET CONVERSATIONS
  useEffect(() => {
    async function getConversations() {
      const response = await axios.get("/conversations")
      // setConversations(response.data)
      setConversations(response.data.slice(0, getRandomNum(1, 10)))
    }
    // getConversations(4)
    setInterval(function () {
      getConversations()
    }, 2000)
  }, [])

  if (!messages) return null
  if (!conversations) return null

  return (
    <>
      <div className="App">
        <h2>Conversations</h2>
        <Conversations conversations={conversations} />
        <h2>Messages</h2>
        <Messages messages={messages} />
      </div>
    </>
  )
}

export default App

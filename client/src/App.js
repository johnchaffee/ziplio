import axios from "axios"
import React, { useEffect, useState } from "react"
import "./App.css"
import Messages from "./Messages"

const baseURL = "/messages"

function App() {
  const [messages, setMessages] = useState(null)
  console.log("Messages: \n", messages)

  // ASYNC AXIOS
  useEffect(() => {
    async function getMessages() {
      const response = await axios.get(baseURL)
      setMessages(response.data)
    }
    getMessages()
  }, [])

  if (!messages) return null

  return (
    <div className="App">
      <Messages messages={messages} />
    </div>
  )

}

export default App

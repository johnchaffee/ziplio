import React from "react"

export default function Messages({ messages }) {
  console.log("RENDER MESSAGES")
  return (
    <div>
      {messages.map((message) => (
        <p key={message.id}>{message.body}</p>
      ))}
    </div>
  )
}

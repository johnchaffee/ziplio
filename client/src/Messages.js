import React, { useEffect, useState } from "react"
import "./messages.css"

export default function Messages({ messages }) {
  return (
    <div>
      <h2>Messages</h2>
      {messages.map((message) => (
        <p key={message.id}>{message.body}</p>
      ))}
    </div>
  )
}
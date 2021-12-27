import React from "react"

export default function Conversations({ conversations }) {
  console.log("RENDER CONVERSATIONS")
  return (
    <div>
      {conversations.map((conversation) => (
        <p key={conversation.id}>{conversation.name}: {conversation.mobileNumber}</p>
      ))}
    </div>
  )
}

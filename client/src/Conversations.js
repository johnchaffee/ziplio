import React from "react"

export default function Conversations({ conversations }) {
  console.log("RENDER CONVERSATIONS")
  return (
    <div>
      {conversations.map((conversation) => (
        <p key={conversation.id}>{conversation.contact_name}: {conversation.conversation_id}</p>
      ))}
    </div>
  )
}

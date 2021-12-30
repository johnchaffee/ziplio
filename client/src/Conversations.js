import React from "react"

export default function Conversations({ conversationsList }) {
  console.log("CONVERSATIONS LIST: ", conversationsList)
  return (
    <div>
      {conversationsList.map((conversation) => (
        <p key={conversation.id}>{conversation.contact_name}: {conversation.conversation_id}</p>
      ))}
    </div>
  )
}

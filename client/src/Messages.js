import React from "react"

export default function Messages({ messagesList }) {
  console.log("MESSAGES LIST: ", messagesList)
  return (
    <div>
      {messagesList.map((message) => (
        <p key={message.id}>{message.body}</p>
      ))}
    </div>
  )
}

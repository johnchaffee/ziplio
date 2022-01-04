import React from "react"

export default function Messages({ messagesList }) {
  console.log("MESSAGES LIST: ", messagesList)
  return (
    <div className="content">
      {messagesList.map((message) => (
        <div key={message.id} className={message.direction}>
          <div className="message-bubble">{message.body}</div>
          <div className="message-footer">Twilio • Time</div>
        </div>
      ))}
    </div>
  )
}
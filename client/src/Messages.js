import React, { useRef, useEffect } from "react"

export default function Messages({ messagesList }) {
  console.log("MESSAGES LIST: ", messagesList)

  const divRef = useRef()

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      })
    }
  })

  return (
    <div className="content">
      {messagesList.map((message) => (
        <div key={message.id} className={message.direction} ref={divRef}>
          <div className="message-bubble">
            {message.media_url !== null && <img src={message.media_url} />}
            {message.body}
          </div>
          <div className="message-footer">Twilio • Time</div>
        </div>
      ))}
    </div>
  )
}

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
        <div key={message.id} ref={divRef}>
          <div className={message.direction + " message-bubble"}>
            {message.media_url !== null && <img src={message.media_url} />}
            {message.body}
          </div>
          <div className={message.direction + " message-footer"}>
            {message.direction === "inbound" ? "Mobile" : "Twilio"}&nbsp;•&nbsp; 
            {new Date(message.date_created).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}

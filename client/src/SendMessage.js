import axios from "axios"
import React, { useState } from "react"
import { mobileNumber } from "./App"

export default function SendMessage() {
  const [messageBody, setMessageBody] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(`Submitting Message "${messageBody}" to ${mobileNumber}`)
    axios
      .post("./messages", {
        body: messageBody,
        mobile_number: mobileNumber,
        media_url: null,
      })
      .then(function (response) {
        console.log("MESSAGE SEND SUCCESS:")
        console.log(response)
      })
      .catch(function (error) {
        console.log("MESSAGE SEND CATCH:")
        console.log(error)
      })
    setMessageBody("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Body:
        <input
          type="text"
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

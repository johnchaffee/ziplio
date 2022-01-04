import axios from "axios"
import React from "react"
import "./App.css"

export default function Conversations({ conversationsList }) {
  console.log("RENDER CONVERSATIONS")

  return (
    <>
      <div id="conversations" className="column">
        <div className="header">
          <div className="header-title">Conversations</div>
          <div className="header-icon-wrapper">
            <img
              onClick={createConversationPrompt}
              className="header-icon"
              src="new.png"
              alt="new conversation"
            />
          </div>
        </div>
        <div className="content">
          {conversationsList.map((conversation) => (
            <div className="conversation-card" key={conversation.id}>
              <div>
                <span className="conversation-badge">4</span>
                <img
                  className="conversation-icon"
                  src="conversation.png"
                  alt="conversation"
                />
                {conversation.contact_name
                  ? conversation.contact_name
                  : conversation.conversation_id.split(";")[1]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  function createConversationPrompt() {
    const mobile_number = prompt(
      "Enter Mobile Number in E.164 format",
      "+12063996576"
    )
    if (mobile_number != null) {
      console.log("CREATE CONVERSATION: " + mobile_number)
      // Send POST request to /conversations
      window.location = "./?mobile=" + encodeURIComponent(mobile_number)
      createConversation(mobile_number)

      function createConversation(mobile_number) {
        axios
          .post("./conversations", {
            mobile_number: mobile_number,
          })
          .then(function (response) {
            console.log("CREATE CONVERSATION SUCCESS:")
            console.log(response)
          })
          .catch(function (error) {
            console.log("CREATE CONVERSATION CATCH:")
            console.log(error)
          })
      }
    }
  }
}

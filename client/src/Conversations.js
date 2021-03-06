import axios from "axios"
import React from "react"
import "./App.css"
import { mobileNumber } from "./App"

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
            <div
              className={
                conversation.conversation_id.split(";")[1] === mobileNumber
                  ? "conversation-card selected"
                  : "conversation-card"
              }
              key={conversation.id}
              onClick={() =>
                selectConversation(conversation.conversation_id.split(";")[1])
              }
            >
              {conversation.unread_count > 0 && (
                <span className="conversation-badge">
                  {conversation.unread_count}
                </span>
              )}
              <img
                className="conversation-icon"
                src="conversation.png"
                alt="conversation"
              />
              {conversation.contact_name
                ? conversation.contact_name
                : conversation.conversation_id.split(";")[1]}
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

  function selectConversation(mobile_number) {
    console.log("selectConversation()")
    console.log(mobile_number)
    if (mobile_number != null) {
      console.log(`SELECT CONVERSATION: ${mobile_number}`)
      resetUnreadCount(mobile_number)
      function resetUnreadCount(mobile_number) {
        axios
          .put("./conversations", {
            unread_count: 0,
            mobile_number: mobile_number,
          })
          .then(function (response) {
            console.log("RESET UNREAD COUNT SUCCESS:")
            console.log(response)
          })
          .catch(function (error) {
            console.log("RESET UNREAD COUNT CATCH:")
            console.log(error)
          })
      }
      window.location = `./?mobile=${mobile_number}`
    }
  }
}

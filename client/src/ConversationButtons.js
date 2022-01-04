import axios from "axios"
import React from "react"
import "./App.css"

export default function ConversationButtons({ conversationsList }) {
  console.log("RENDER CONVERSATIONS")

  return (
    <>
      <div className="header">
        <div className="header-title">Messages</div>
        <div className="header-icon-wrapper">
          <img
            className="header-icon"
            src="contact.png"
            alt="name conversation"
            onClick={() => updateContactPrompt("+12063996576")}
          />
          <img
            className="header-icon"
            src="archive.png"
            alt="archive conversation"
            onClick={() => archiveConversationButton("+12063996576", "closed")}
          />
          <img
            className="header-icon"
            src="delete.png"
            alt="delete conversation"
            onClick={() => archiveConversationButton("+12063996576", "deleted")}
          />
        </div>
      </div>
    </>
  )

  function updateContactPrompt(mobile_number) {
    console.log("updateContactPrompt()")
    console.log("MOBILE NUMBER: ", mobile_number)
    const contact_name = prompt("Enter contact name")
    if (contact_name != null) {
      console.log("UPDATE CONTACT: " + contact_name)
      updateContact(mobile_number, contact_name)

      function updateContact(mobile_number, contact_name) {
        axios
          .put("./conversations", {
            contact_name: contact_name,
            mobile_number: mobile_number,
          })
          .then(function (response) {
            console.log("UPDATE CONTACT SUCCESS:")
            console.log(response)
          })
          .catch(function (error) {
            console.log("UPDATE CONTACT CATCH:")
            console.log(error)
          })
      }
    }
  }

  function archiveConversationButton(mobile_number, status) {
    console.log("archiveConversationButton()")
    console.log(mobile_number)
    console.log("STATUS")
    console.log(status)
    if (mobile_number != null) {
      console.log(`ARCHIVE CONVERSATION: ${mobile_number}, ${status}`)
      archiveConversation(mobile_number, status)
      function archiveConversation(mobile_number, status) {
        axios
          .put("./conversations", {
            mobile_number: mobile_number,
            status: status,
          })
          .then(function (response) {
            console.log("ARCHIVE CONVERSATION SUCCESS:")
            console.log(response)
            window.location = "./"
          })
          .catch(function (error) {
            console.log("ARCHIVE CONVERSATION CATCH:")
            console.log(error)
          })
      }
    }
  }
}

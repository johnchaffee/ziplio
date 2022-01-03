import axios from "axios"
import React from "react"

export default function Conversations({ conversationsList }) {
  console.log("RENDER CONVERSATIONS")

  return (
    <div>
      <button className="btn btn-light p-0" onClick={createConversationPrompt}>
        <i className="far fa-edit"></i>
      </button>

      {conversationsList.map((conversation) => (
        <p key={conversation.id}>
          {conversation.contact_name}: {conversation.conversation_id.split(";")[1]}
          <button
            className="btn btn-light p-0"
            onClick={() =>
              updateContactPrompt(conversation.conversation_id.split(";")[1])
            }
          >
            <i className="fas fa-id-card-alt"></i>
          </button>
          <button
            className="btn btn-light p-0"
            onClick={() =>
              archiveConversationButton(
                conversation.conversation_id.split(";")[1],
                "closed"
              )
            }
          >
            <i className="fas fa-archive"></i>
          </button>
          <button
            className="btn btn-light p-0"
            onClick={() =>
              archiveConversationButton(
                conversation.conversation_id.split(";")[1],
                "deleted"
              )
            }
          >
            <i className="far fa-trash-alt"></i>
          </button>
        </p>
      ))}
    </div>
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

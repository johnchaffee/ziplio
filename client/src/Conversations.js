import axios from "axios"
import React, { useEffect, useState } from "react"
import { wsClient } from "./App"

export default function Conversations() {
  console.log("RENDER CONVERSATIONS")

  // CONVERSATIONS STATE
  const [conversationsList, setConversationsList] = useState(null)
  console.log("conversationsList: \n", conversationsList)

  // ASYNC AXIOS GET CONVERSATIONS
  useEffect(() => {
    async function getConversations() {
      const response = await axios.get("/conversations")
      setConversationsList(response.data)
    }
    getConversations()
  }, [])

  // MESSAGE RECEIVED FROM SERVER ->
  wsClient.onmessage = (event) => {
    const messages = JSON.parse(event.data)
    console.log("CLIENT ON MESSAGE")
    console.log(messages)
    // Play Audio for incoming and outgoing messages
    if (
      messages.length > 0 &&
      messages[0].type !== undefined &&
      messages[0].type.startsWith("conversation")
    ) {
      // If first array type is conversationSomething, update conversationList and re-render conversation list
      console.log("MESSAGES[0]: ", messages[0])
      let updateConversationList = conversationsList.filter(
        (conversation) => conversation.id !== messages[0].id
      )
      updateConversationList.unshift(messages[0])
      console.log("UPDATE CONVERSATION LIST: ", updateConversationList)
      setConversationsList(updateConversationList)
    } else {
      console.log("EMPTY MESSAGE, DO NOTHING")
      console.log(messages.length)
    }
  }

  if (!conversationsList) return null

  return (
    <div>
      <button className="btn btn-light p-0" onClick={createConversationPrompt}>
        <i className="far fa-edit"></i>
      </button>

      {conversationsList.map((conversation) => (
        <p key={conversation.id}>
          {conversation.contact_name}:{" "}
          {conversation.conversation_id.split(";")[1]}
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
    console.log("MOBILE NUMBER")
    console.log(mobile_number)
    console.log(mobile_number)
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
            async function getConversations() {
              const response = await axios.get("/conversations")
              setConversationsList(response.data)
            }
            getConversations()
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
            async function getConversations() {
              const response = await axios.get("/conversations")
              setConversationsList(response.data)
            }
            getConversations()
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

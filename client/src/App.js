import React from "react"
import "./App.css"
import SendMessage from "./SendMessage"
import Messages from "./Messages"
import Conversations from "./Conversations"

function App() {
  console.log("RENDER APP")

  return (
    <>
      <div className="SplitPane">
        <div className="SplitPane-left">
          <h2>Conversations</h2>
          <Conversations />
        </div>
        <div className="SplitPane-right">
          <h2>Messages</h2>
          <Messages />
          <h2>SendMessage</h2>
          <SendMessage />
        </div>
      </div>
    </>
  )
}

const urlParams = new URLSearchParams(window.location.search)
// console.log(`urlParams: ${urlParams}`)
const mobileParam = urlParams.get("mobile")
// console.log(`mobileParam: ${mobileParam}`)
// const mobileParamEncoded = encodeURIComponent(urlParams.get("mobile")) // %2B12065551111
// console.log(`mobileParamEncoded: ${mobileParamEncoded}`)
const mobileParamDecoded = decodeURIComponent(mobileParam) // +12065551111
// console.log(`mobileParamDecoded: ${mobileParamDecoded}`)
export const mobileNumber = mobileParamDecoded
console.log(`URL PARAM MOBILE NUMBER: ${mobileNumber}`)

const host = window.location.origin
console.log(`HOST: ${host}`)

let wsHost
if (process.env.NODE_ENV === "development") {
  wsHost = host.replace(/^http/, "ws").replace("3000", "3001")
} else {
  wsHost = host.replace(/^http/, "ws")
}
console.log(`WSHOST: ${wsHost}`)

export const wsClient = new WebSocket(wsHost)

wsClient.onopen = () => {
  console.log("ON CONNECTION")
  console.log("Websocket connected to: " + wsClient.url)
  // Do nothing
}

wsClient.onclose = () => {
  console.log("ON CLOSE")
}

export default App

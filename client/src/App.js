import axios from "axios"
import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"

const baseURL = "/api"

function App() {
  const [data, setData] = useState(null)

  // AXIOS SYNC
  // useEffect(() => {
  //   axios.get(baseURL).then((response) => {
  //     console.log("response.data ", response.data)
  //     setData(response.data.message)
  //   })
  // }, [])
  

  // AXIOS ASYNC/AWAIT
  useEffect(() => {
    async function getData() {
      const response = await axios.get(baseURL)
      setData(response.data.message)
    }
    getData()
  }, [])

  if (!data) return null

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  )
}

export default App

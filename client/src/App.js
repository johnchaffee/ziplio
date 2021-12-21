import axios from "axios"
import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"

const baseURL = "/api"

function App() {
  const [data, setData] = useState(null)

  // FETCH
  // useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>{!data ? "Loading..." : data}</p>
  //     </header>
  //   </div>
  // );

  // AXIOS
  useEffect(() => {
    axios.get(baseURL).then((response) => {
      console.log("response.data ", response.data)
      setData(response.data.message)
    })
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

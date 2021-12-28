import axios from "axios"
import React from "react"

export default class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: "" }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    alert("A message was submitted: " + this.state.value)
    console.log("this.state.value: ", this.state.value)
    axios
      .post("./messages", {
        body: this.state.value,
        mobile_number: "+12063996576",
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
    event.preventDefault()
    this.setState({ value: "" })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Send Message:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

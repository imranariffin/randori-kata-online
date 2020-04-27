import React from 'react'
import socketio from 'socket.io-client'

import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.textRef = React.createRef()
    this.state = {
      message: '',
      messages: [],
      socket: null,
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Randori Kata Online
          </h1>
        </header>
        <section>
          <ul>
            {
              this.state.messages.map((message) => (
                <li>
                  {message}
                </li>
              ))
            }
          </ul>
        </section>
        <section>
          <textarea
            // defaultValue={this.state.messages.join('\n')}
            ref={this.textRef}
          >
          </textarea>
          <button onClick={this.handleSendMessage}>Send message</button>
        </section>
      </div>
    )
  }

  componentDidMount() {
    const socket = socketio('http://localhost:3000')
    this.setState({ socket }, () => {
      socket.on('chat-message', (message) => {
        console.log('Message received:', message)
        this.setState({ messages: this.state.messages.concat(message) })
      })
    })
  }

  handleSendMessage = (event) => {
    const { socket } = this.state
    console.log(this.textRef.current.value)
    const { current: { value: message } } = this.textRef
    socket.emit('chat-message', message)
  }

  handleChangeMessage = (event) => {
    console.log(event.target.value)
    const { target: { value } } = event
    this.setState({ message: value })
  }
}

export default App

import React from "react"
import ReactDOM from "react-dom"
import socket from "./socket.js"
import Game from "./App.js"
import registerServiceWorker from "./registerServiceWorker.js"

ReactDOM.render(<Game/>, document.getElementById("root"))
registerServiceWorker()

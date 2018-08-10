import React from "react"
import ReactDOM from "react-dom"
import socket, { history } from "./socket.js" //Starts socket && history
import Game from "./App.js"
import registerServiceWorker from "./registerServiceWorker.js"

ReactDOM.render(<Game/>, document.getElementById("root"))
registerServiceWorker()

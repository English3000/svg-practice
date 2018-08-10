import React from "react"
import ReactDOM from "react-dom"
import socket, { history } from "./socket.js" //Starts socket && history
import Game from "./App.js"
import registerServiceWorker from "./registerServiceWorker.js"
import { StyleSheet } from "react-native-web"

export default StyleSheet.create({
  row: {flexDirection: "row"}
})

ReactDOM.render(<Game/>, document.getElementById("root"))
registerServiceWorker()

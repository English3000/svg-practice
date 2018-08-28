import React from "react"
import { View, Text } from "react-native"
import ReactDOM from "react-dom"
import Game from "./App.js"
import Draggable from "./components/draggable.js"
import registerServiceWorker from "./registerServiceWorker.js"

ReactDOM.render(<Draggable/>, document.getElementById("root"))
registerServiceWorker()

import React from "react"
import { View, Text, Platform } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary"
# import Page from "./pages"
# import Screen from "./screens"
import socket, { join_game } from "./socket"
# determines how to display
export default class Display extends React.Component
  # constructor(){
  #   this.state = {stage: /* from channel */}
  # }

  render:  ->
    console.log join_game(socket, "test game", "p1")
    return (
      <ErrorBoundary>
        <Text>{
          Platform.OS == "web" ? "web" : "screen"
        # Platform.OS === "web" ? <Page/> : <Screen/>
        }</Text>
      </ErrorBoundary>
    )
  #

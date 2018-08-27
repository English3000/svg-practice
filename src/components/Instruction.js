import React from "react"
import { Text } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
// coupled to IslandsEngine.Game.Stage atoms
function renderInstruction(instruction){
  switch (instruction) {
    case "joined":
      return <Text>Drag your islands onto the board!</Text>
    case "ready":
      return <Text>Waiting for other player...</Text>
    case "turn":
      return <Text>Your turn! Click a coordinate on your opponent's board to attack.</Text>
    case "wait":
      return <Text>Your opponent attacking...</Text>
    case "won":
      return <Text>Congrats! You've WON.</Text>
    case "lost":
      return <Text>Your opponent has won... Better luck next game!</Text>
    default:
      return null
  }
}

export default ({message}) =>
  <ErrorBoundary>
    { message.error ?
       <Text>{message.error}</Text> :
       renderInstruction(message.instruction) }
  </ErrorBoundary>

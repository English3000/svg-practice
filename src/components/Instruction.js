import React from "react"
import { StyleSheet, Text } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
// coupled to IslandsEngine.Game.Stage atoms
function renderInstruction(instruction){
  switch (instruction) {
    case "joined":
      return "Drag your islands onto the board!"
    case "ready":
      return "Waiting for other player..."
    case "turn":
      return "YOUR TURN: Click on a square to attack."
    case "wait":
      return "Your opponent is attacking..."
    case "won":
      return "Congrats! You've WON."
    case "lost":
      return "Your opponent has won... Better luck next game!"
    default:
      return null
  }
}

export default ({message}) =>
  <ErrorBoundary>
    <Text style={custom.instruction}>
      {message.error ?
        "ERROR: " + message.error.replace(/_/, " ") : renderInstruction(message.instruction)}
    </Text>
  </ErrorBoundary>

const custom = StyleSheet.create({
  instruction: {textAlign: "center", fontSize: 24, margin: 18}
})

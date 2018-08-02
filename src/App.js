import React from "react"
import { StyleSheet, View, Dimensions, Platform } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary"
// import Game as Page from "./pages"
// import Game as Screen from "./screens"
import { new_channel, join, new_game, add_player } from "./socket"
// determines how to display
export default class Display extends React.Component {
  // constructor(){
  //   this.state = {stage: /* from channel */}
  // }

  render(){
    const channel = new_channel("player1", "name")
    join(channel)
    new_game(channel)
    console.log(add_player(channel, "p2"));
    return (
      <ErrorBoundary>{
        // Platform.OS === "web" ? <Page/> : <Screen/>
      }</ErrorBoundary>
    )
  }
}

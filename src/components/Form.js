import React from "react"
import ErrorBoundary from "./ErrorBoundary"
import { View, TextInput, Button } from "react-native"
import { CheckBox } from "react-native-elements"
import socket, { new_channel, join } from "../socket"

// Issue w/ book code: on refresh, lose your page
// Could put game & player in query string so can re-fetch on refresh
// This means setting up routing

export default class Form extends React.Component {
  constructor(){
    this.state = { channel: null,
                   player:  null,
                   newGame: false,
                   errors:   [] }

    this.playGame = this.playGame.bind(this)
  }

  render(){
    const {channel, player, newGame} = this.state

    <ErrorBoundary>
      <View style={{flexDirection: "row"}}>
        <TextInput value={channel}
                   placeholder="Game"
                   onChangeText={text => this.setState({channel: text})}/>

        <TextInput value={player}
                   placeholder="Player"
                   onChangeText={text => this.setState({player: text})}/>

        <CheckBox  value={newGame}
                   onPress={() => this.setState({newGame: !newGame})}/>

        <Button    value="ENTER"
                   onPress={() => this.playGame}/>
      </View>
    </ErrorBoundary>
  }

  playGame(){
    const {channel, player, newGame, errors} = this.state

    let newErrors = []

    if (!channel) newErrors.push("Please type a game to join.")
    if (!player)  newErrors.push("Choose a player name.")
    if (channel && player) {
      const game = new_channel(channel, player, player)
      join(game)
      if (newGame) {

      } else {

      }
    }
  }
}

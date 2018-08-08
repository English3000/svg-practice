import React from "react"
import { View, TextInput, Button, Text } from "react-native"
import socket, { join_game } from "../socket.js"
import ErrorBoundary from "./components/ErrorBoundary.js"

export default class Instructions extends React.Component{
  constructor(){
    super()
    // need to consider crash handling... rejoin game via query string
    /* if app crashes, how does that work?
      (1) page refresh erases state -- can refetch via rejoin via query string
      (2) server crashes -- supervisor would restart game (w/ saved state)
          Does browser maintain history on crash? If so, same approach works...
            From search, looks like browsers are built to be robust.
            Also, when Firefox closes, it auto-opens my tabs.
            If it restarts, I am able to restore my last session.
          I'll assume the browser will handle it's own crashes; I'll just worry about the server.
    */
    this.state = { form: {game: null, player: null},
                   error: null,
                   instruction: null }

    this.joinGame = this.joinGame.bind(this)
  }

  render(){
    const { form, error, instruction } = this.state
    return (
      <ErrorBoundary key="dimensions">
        {form ?
          <View key="form">
            <TextInput onChangeText={  game => this.setState({form: {game}})}
                       placeholder="game"
                       value={form.game}/>
            <TextInput onChangeText={player => this.setState({form: {player}})}
                       placeholder="player"
                       value={form.player}/>
            <Button    onPress={this.joinGame}
                       title="JOIN"/>
          </View> : null }

        {error ? <Text>{error}</Text> :
         instruction ? <Text>{instruction}</Text> :
        null}
      </ErrorBoundary>
    )
  }

  joinGame(){ // needs to modify query string too
    const { game, player } = this.state.form
    if (game && player) join_game(socket, game, player)
                          .receive("ok", () => this.setState({form: false}))
                          .receive("error", response => this.setState({error: response.reason}))
  }
}

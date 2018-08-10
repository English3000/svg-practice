import React from "react"
import { View, TextInput, Button, Text } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import socket, { history, join_game } from "../socket.js"
import queryString from "query-string"

export default class Instructions extends React.Component{
  constructor(){
    super()
    const form  = (history.location.search.length > 1) ?
                    false :
                    {game: "", player: "", complete: false}
    this.state  = {form, error: null, instruction: null}

    this.handleInput = this.handleInput.bind(this)
  }

  // handle server crashes (browser handles its own) -- refetch game via rejoin via query string
  componentDidMount(){
    if (!this.state.form) {
      const query = queryString.parse(history.location.search)
      this.joinGame(query.game, query.player)
    }
  }

  joinGame(game, player){
    if (game.length > 0 && player.length > 0)
      join_game(socket, game, player)
        .receive("ok", ({player1, player2}) => {
          history.push(`/?game=${game}&player=${player}`)
          if (player1.name === player) this.setState({form: false, error: null, instruction: player1.stage})
          if (player2.name === player) this.setState({form: false, error: null, instruction: player2.stage})
      }).receive("error", response => this.setState({error: response.reason}))
  }
  handleInput(event){
    const {name, value}            = event.target
    const {game, player, complete} = this.state.form
    let   form

    if (name === "game") {
      form = player.length > 0 ?
        {game: value, player, complete: true} :
        {game: value, player, complete}
    } else { // name === "player"
      form = game.length > 0 ?
        {game, player: value, complete: true} :
        {game, player: value, complete}
    }

    this.setState({form})
  }

  render(){
    const { form, error, instruction } = this.state
    return ( // * add onEnter functionality if form.complete *
      <ErrorBoundary key="dimensions">
        {form ?
          <View key="form">
            <TextInput onChange={this.handleInput}
                       name="game"
                       placeholder="game"
                       value={form.game}/>
            <TextInput onChange={this.handleInput}
                       name="player"
                       placeholder="player"
                       value={form.player}/>
            {form.complete ?
              <Button  onPress={() => this.joinGame(form.game, form.player)}
                       title="JOIN"/> :
              null}
          </View> : null }

        {error ?
          <Text>{error}</Text> :
          this.renderInstruction()}
      </ErrorBoundary>
    )
  }

  // coupled to IslandsEngine.Game.Stage atoms
  renderInstruction(){
    switch (this.state.instruction) {
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
}

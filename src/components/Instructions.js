import React from "react"
import { View, TextInput, Button, Text } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import socket, { history, join_game } from "../socket.js"
import queryString from "query-string"

export default class Instructions extends React.Component{
  constructor(){
    super()
    const query = queryString.parse(history.location.search)
    const form = (query.game && query.player) ? false : {game: "", player: "", complete: false}
    this.state = { form, error: null, instruction: null }

    this.handleInput = this.handleInput.bind(this)
  }

  // handle server crashes (browser handles its own) -- refetch game via rejoin via query string
  componentDidMount(){
    const query = queryString.parse(history.location.search)
    if (query.game && query.player) this.joinGame(query.game, query.player)
    // console.log("joined");
  }

  render(){
    const { form, error, instruction } = this.state
    return (
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

        {error ? <Text>{error}</Text> :
         instruction ? <Text>{instruction}</Text> :
        null}
      </ErrorBoundary>
    )
  }

  handleInput(event){
    const {name, value}            = event.target
    const {game, player, complete} = this.state.form
      let form

    if (name === "game") {
      form = player.length > 0 ?
        {game: value, player, complete: true} :
        {game: value, player, complete}
    } else {
      form = game.length > 0 ?
        {game, player: value, complete: true} :
        {game, player: value, complete}
    }

    this.setState({form})
  }

  joinGame(game, player){
    if (game.length > 0 && player.length > 0)
      join_game(socket, game, player)
        .receive("ok", () => { history.push(`/?game=${game}&player=${player}`)
                               this.setState({form: false}) })
        .receive("error", response => this.setState({error: response.reason}))
  }
}

import React from "react"
import { Platform, View, TextInput, Button, Text } from "react-native"
import styles from "./index.js"
import ErrorBoundary from "./components/ErrorBoundary.js"
import Instruction from "./components/Instruction.js"
// import WebGameplay from "./pages/Gameplay.js"
// import MobileGameplay from "./screens/Gameplay.js"
import socket, { history, join_game } from "./socket.js"
import queryString from "query-string"

export default class Game extends React.Component{
  constructor(){
    super()
    this.state = history.location.search.length > 1 ?
                  { form: false } :
                  { form: {game: "", player: "", complete: false} }
    this.handleInput = this.handleInput.bind(this)
  }

  render(){
    const { form, message, payload, ids } = this.state
    return ( // * add onEnter functionality if form.complete *
      <ErrorBoundary>
        <View key="dimensions">
          {form ? [
            <View key="inputs" style={styles.row}>
              <TextInput onChange={this.handleInput}
                         name="game"
                         placeholder="game"
                         value={form.game}/>
              <TextInput onChange={this.handleInput}
                         name="player"
                         placeholder="player"
                         value={form.player}/>
            </View>,

            form.complete ?
              <Button onPress={() => this.joinGame(form)}
                      title="JOIN"
                      key="button"/> : null
          ] : null}

          {message ?
            <Instruction message={message}/> : null}

          {payload ?
            Platform.OS === "web" ?
              <Text>web</Text> :
              <Text>mobile</Text> :
              //    <WebGameplay game={payload} player={id}/> :
              // <MobileGameplay game={payload} player={id}/> :
            null}
        </View>
      </ErrorBoundary>
    )
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
  joinGame(params){
    const {game, player} = params
    if (game.length > 0 && player.length > 0)
      join_game(socket, game, player)
        // .on("event", handlers)
        .receive("ok", payload => {
          history.push(`/?game=${game}&player=${player}`)
          const {player1, player2} = payload
          if (player1.name === player) this.setState({ form: false, message: {instruction: player1.stage}, payload, id: "player1" })
          if (player2.name === player) this.setState({ form: false, message: {instruction: player2.stage}, payload, id: "player2" })
      }).receive("error", response => this.setState({ message: {error: response.reason} }))
  }
  // handle server crashes (browser handles its own) -- refetch game via rejoin via query string
  componentDidMount(){
    const query = history.location.search
    if (query.length > 1) this.joinGame(queryString.parse(query))
  }
}

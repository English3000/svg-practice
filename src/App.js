import React from "react"
import { StyleSheet, Platform, View, TextInput, Button } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary.js"
import Instruction from "./components/Instruction.js"
import Gameplay from "./components/Gameplay.js"
import socket, { history, channel } from "./socket.js"
import queryString from "query-string"
import merge from "lodash.merge"
// import Loadable from "react-loadable"                                        comment prepends value to webpack IO
// const Gameplay = Loadable({ loader: () => import("./components/Gameplay.js" /* webpackChunkName: "Gameplay" */),
//                             loading: Loading })
// Loading == util component like ErrorBoundary
export const styles = StyleSheet.create({
  row: {flexDirection: "row"}
})

export default class Game extends React.Component{
  constructor(){
    super()
    this.state = history.location.search.length > 1 ?
                  { form: false } :
                  { form: {game: "", player: "", complete: false} }
  }

  render(){
    const { form, message, payload, id } = this.state
    return (
      <ErrorBoundary>
        {form ? [
          <View key="inputs" style={[styles.row, Platform.OS !== "web" ? {marginTop: 24} : {}]}>
            <TextInput onChangeText={text => this.handleInput("game", text)}
                       placeholder="game"
                       style={{width: "50%"}}
                       value={form.game}
                       onKeyPress={event => form.complete && event.keyCode === 13 ? // onEnter
                                              this.joinGame(form) : null}
                       autoFocus/>

            <TextInput onChangeText={text => this.handleInput("player", text)}
                       placeholder="player"
                       style={{width: "50%"}}
                       value={form.player}
                       onKeyPress={event => form.complete && event.keyCode === 13 ? // onEnter
                                              this.joinGame(form) : null}/>
          </View>,

          form.complete ?
            <Button onPress={() => this.joinGame(form)}
                    title="JOIN"
                    key="button"/> : null
        ] : null}

        {message ?
          <Instruction message={message}/> : null}

        {(payload && id.length > 0) ?
          <Gameplay game={payload} player={id}/> : null}
      </ErrorBoundary>
    )
  }
  handleInput(name, value){
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
  joinGame(params){ // not joining on mobile
    const {game, player} = params
    if (game.length > 0 && player.length > 0) {
      channel(socket, game, player)
        .join()
        .receive("ok", payload => {
          const {player1, player2} = payload
          if (player1.name === player) this.setState({ form: false, message: {instruction: player1.stage}, payload, id: "player1" })
          if (player2.name === player) this.setState({ form: false, message: {instruction: player2.stage}, payload, id: "player2" })
          history.push(`/?game=${game}&player=${player}`)
      }).receive("error", response => this.setState({ message: {error: response.reason} }))
    }
  }
  // Handles server crashes (browser handles its own): refetches game by rejoining it via query string.
  componentDidMount(){
    const query = history.location.search
    if (query.length > 1) this.joinGame(queryString.parse(query))
  }
}

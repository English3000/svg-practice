import React from "react"
import { View, TextInput, Button } from "react-native"
import styles from "./index.js"
import ErrorBoundary from "./components/ErrorBoundary.js"
import Instruction from "./components/Instruction.js"
import Gameplay from "./components/Gameplay.js"
import socket, { history, channel } from "./socket.js"
import queryString from "query-string"
import merge from "lodash.merge"

export default class Game extends React.Component{
  constructor(){
    super()
    this.state = history.location.search.length > 1 ?
                  { form: false } :
                  { form: {game: "", player: "", complete: false} }
    this.handleInput = this.handleInput.bind(this)
  }

  render(){
    const { form, message, payload, id } = this.state
    return (
      <ErrorBoundary>
        <View key="dimensions">
          {form ? [
            <View key="inputs" style={styles.row}>
              <TextInput onChange={this.handleInput}
                         name="game"
                         placeholder="game"
                         value={form.game}
                         onKeyDown={event => form.complete && event.keyCode === 13 ? // onEnter
                                               this.joinGame(form) : null}/>
              <TextInput onChange={this.handleInput}
                         name="player"
                         placeholder="player"
                         value={form.player}
                         onKeyDown={event => form.complete && event.keyCode === 13 ? // onEnter
                                               this.joinGame(form) : null}/>
            </View>,

            form.complete ?
              <Button onPress={() => this.joinGame(form)}
                      title="JOIN"
                      key="button"/> : null
          ] : null}

          {message ?
            <Instruction message={message}/> : null}

          {payload ?
            <Gameplay game={payload} player={id}/> : null}
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
    if (game.length > 0 && player.length > 0) {
      let gameChannel = channel(socket, game, player) // validate all handlers
      gameChannel.on( "error",                error => this.setState({error}) )
      gameChannel.on( "island_placed",       island => this.setState({payload: this.updatePayload("island_placed", island)}) )
      gameChannel.on( "island_removed",         key => this.setState({payload: this.updatePayload("island_removed", key)}) )
      gameChannel.on( "islands_set",    stageAndKey => this.setState({payload: this.updatePayload("islands_set", stageAndKey)}) )
      gameChannel.on( "coordinate_guessed", results => this.setState({payload: this.updatePayload("coordinate_guessed", results)}) )
      gameChannel.join()
        .receive("ok", payload => {
          history.push(`/?game=${game}&player=${player}`)
          const {player1, player2} = payload
          if (player1.name === player) this.setState({ form: false, message: {instruction: player1.stage}, payload, id: "player1" })
          if (player2.name === player) this.setState({ form: false, message: {instruction: player2.stage}, payload, id: "player2" })
      // `join_game` has own error-handling b/c can't add event listeners until AFTER joined channel
      }).receive("error", response => this.setState({ message: {error: response.reason} }))
      gameChannel.on( "game_joined",        payload => this.setState({payload}) )
    }
  } // When done, can write blog post about my channel-based architecture. (submit this to Elixir Radar)

  /* TRADEOFF: This reducer, `updatePayload`, is coupled to the backend.
      In exchange, the backend can send significantly lighter payloads.

      Think of this as a channel-based, simplified version of Redux:
       Instead of having a store, joining the channel sets an initial payload to the root component.
       Instead of actions and an API, `socket.js` stores channel functions.
       Instead of reducers, the root component implements event listeners which invoke a single payload reducer to update state.
       Instead of containers, the root component passes its state down.

      PROS:
       + significantly reduced complexity on frontend (with exception of root component)
       + no additional complexity on backend
       + easier to debug (can still debug within reducer)
       (+ backend eliminates database latency)

      CONS:
       - full app re-renders on event >> VALIDATE, then explore minimal Redux solution...

      NEUTRAL:
       > props are passed down the component hierarchy -- Relay requires this too
       > for SSR, hold state in `conn.assigns` */
  updatePayload(event, response){
    const {id, payload} = this.state
    let update
    switch (event) {
      case "island_placed": // response === island
        update = { [id]: {islands: {[response.type]: response}} }
        break
      case "island_removed": // response === key
        let newPayload = merge({}, payload)
        delete newPayload[id].islands[response]
        return newPayload
      case "islands_set": // response === {stage, key} of player
        update = { [response.key]: {stage: response.stage} }
        break
      case "coordinate_guessed":
        const key = response.result.key ? "hits" : "misses"
        update = { [response.player]: {guesses: {[key]: payload[response.player].guesses[key].concat({row: response.row, col: response.col})}} }
        if (response.result.status) {
          const opp = response.player === "player1" ?
                        "player2" : "player1"
          let secondUpdate = { [response.player]: {stage: "won"},
                               [opp]: {stage: "lost"} }
          return merge({}, payload, update, secondUpdate)
        }
        break
    }
    return merge({}, payload, update)
  }
  // Handles server crashes (browser handles its own): refetches game by rejoining it via query string.
  componentDidMount(){
    const query = history.location.search
    if (query.length > 1) this.joinGame(queryString.parse(query))
  }
}

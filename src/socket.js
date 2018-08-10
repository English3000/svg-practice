import {Socket} from "phoenix-socket"
import createHistory from "history/createBrowserHistory"

export const history = createHistory() //onBack => exit_game(channel)

// in package.json, can add "proxy": "http://localhost:4000/",
let socket = new Socket("ws://localhost:4000/socket", {})
socket.connect()
export default socket

// export const channel = (socket) =>
//   socket.channel("game:" + game, {screen_name: player})

export const join_game = (socket, game, player) =>
  socket.channel("game:" + game, {screen_name: player}).join()

export const get_state = (channel, game, player) => // @
  channel.push("get_state", {game, player})
         .receive("error", response => response.reason)

export const place_island = (channel, player, island, row, col) =>
  channel.push("place_island", {player, island, row, col}) // place if OK
      // .receive("ok", response => this.setState({ }))
         .receive("error", response => response.reason)

export const set_islands = (channel, player) =>
  channel.push("set_islands", player)
         // .receive("ok", response => this.setState({stage: {turn: 1}}))
         .receive("error", response => response.reason) // TEST

// Broadcasted player atom
// channel.on("islands_set", response => {console.log("Player has set all islands", response)})

export const guess_coordinate = (channel, player, row, col) =>
  channel.push("guess_coordinate", {player, row, col})
         .receive("error", response => response.reason)

// Broadcasted guess result
// channel.on("guessed_coordinate", response => {console.log("Player made guess:", response.result)})

export const exit_game = (channel) =>
  channel.exit()
         .receive("ok",    response => console.log("Exited channel",         response))
         .receive("error", response => console.log("Failed to exit channel", response))

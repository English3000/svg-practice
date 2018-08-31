import {Socket} from "phoenix"
import createHistory from "history/createMemoryHistory"

export const history = createHistory() //onBack => exit_game(channel)
// in package.json, can add "proxy": "http://localhost:4000/",
let socket = new Socket("ws://localhost:4000/socket", {})
socket.connect()
export default socket

export const channel = (socket, game, player) =>
  socket.channel("game:" + game, {screen_name: player})

// export const get_state = (channel, game, player) =>
//   channel.push("get_state", {game, player})
//          .receive("error", response => response.reason)

// API
export const place_island = (channel, player, island, row, col) =>
  channel.push("place_island", {player, island, row, col})

export const delete_island = (channel, player, island) =>
  channel.push("delete_island", {player, island})

export const set_islands = (channel, player) =>
  channel.push("set_islands", player)

export const guess_coordinate = (channel, player, row, col) =>
  channel.push("guess_coordinate", {player, row, col})

export const exit_game = (channel) =>
  channel.exit()
         .receive("ok",    response => console.log("Exited channel",         response))
         .receive("error", response => console.log("Failed to exit channel", response))

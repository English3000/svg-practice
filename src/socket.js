import {Socket} from "phoenix"
import createHistory from "history/createMemoryHistory"

export const history = createHistory() //onBack => exit_game(channel)
// in package.json, can add "proxy": "http://localhost:4000/",
let socket = new Socket("ws://localhost:4000/socket", {})
socket.connect()
export default socket

export const channel = (socket, game, player) =>
  socket.channel("game:" + game, {screen_name: player})

export const set_islands = (channel, player, islands) =>
  channel.push("set_islands", player, islands)

export const guess_coordinate = (channel, player, row, col) =>
  channel.push("guess_coordinate", {player, row, col})

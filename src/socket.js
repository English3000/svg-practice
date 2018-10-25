import { Socket } from "phoenix"
import createHistory from "history/createMemoryHistory"
import { Platform } from "react-native"

export const history = createHistory() // onBack, onRefresh => channel.leave()

let server
if (process.env.NODE_ENV === "development") {
  server = (Platform.OS === "web") ? "localhost:4000" : "192.168.43.62:4000" // wifi IP
} else {
  server = "islands.gigalixirapp.com"
}

let socket = new Socket(`ws://${server}/socket`, {})
socket.connect()
export default socket

export const channel = (socket, game, player) =>
  socket.channel("game:" + game, {screen_name: player})

export const set_islands = (channel, player, islands) =>
  channel.push("set_islands", player, islands)

export const guess_coordinate = (channel, player, row, col) =>
  channel.push("guess_coordinate", {player, row, col})

import {Socket} from "phoenix-socket" // https://hexdocs.pm/phoenix/js/

let socket = new Socket("ws://localhost:4000/socket", {})
socket.connect()
export default socket // socket.channels[0] => channel

const channel = (socket) =>
  socket.channel("game:" + game, {screen_name: player})
  // could have `.on` listener w/in component of choice, which updates its state
        // .on("game_joined", response => response)

export const join_game = (socket, game, player) =>
  socket.channel("game:" + game, {screen_name: player}).join()
        // should probably define w/in component
        .receive("error", response => response.reason)

export const get_state = (channel, game, player) =>
  channel.push("get_state", {game, player})
         .receive("error", response => response.reason)

export const place_island = (channel, player, island, row, col) =>
  channel.push("place_island", {player, island, row, col}) // place if OK
         .receive("error", response => response.reason)

export const set_islands = (channel, player) =>
  channel.push("set_islands", player)
         .receive("ok",    response => {console.log("Board:"); console.dir(response); return response})
         .receive("error", response => response.reason) // TEST

// Broadcasted player atom
// channel.on("islands_set", response => {console.log("Player has set all islands", response)})

export const guess_coordinate = (channel, player, row, col) =>
  channel.push("guess_coordinate", {player, row, col})
         .receive("error", response => console.log(`${player} could not guess.`, response))

// Broadcasted guess result
// channel.on("guessed_coordinate", response => {console.log("Player made guess:", response.result)})

export const exit_game = (channel) =>
  channel.exit()
         .receive("ok",    response => console.log("Exited channel",         response))
         .receive("error", response => console.log("Failed to exit channel", response))

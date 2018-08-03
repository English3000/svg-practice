// TODO: Wrap functionality w/in React Native Web components (a la demo front end provided)
import {Socket} from "phoenix-socket" // https://hexdocs.pm/phoenix/js/
let socket = new Socket("ws://localhost:4000/socket", {})
// SOCKET
/* {
  channels: [],
  conn: WebSocket,
  ...
} */
socket.connect()
export default socket

// game_channel.on("subscribers", response => {console.log("Current players online:", response)})
  // To see, in browser console, copy, paste, then type: game_channel.push("show_subscribers")

export const join_game = (socket, game, player) =>
  socket.channel("game:" + game, {screen_name: player}).join()
        .receive("ok",    response => {console.log("Joined channel!", response); return response})
        .receive("error", response => {console.log(response.reason)})
/* {
  event: "phx_join",
  channel: Channel,
  payload: Channel.params
} */
// join(game_channel)

// Create a channel event function for each handle_in/3 clause in the GameChannel.
// DEPRECATED: join now handles functionality
/* export const new_game = (channel) =>
  channel.push("new_game", channel.params.screen_name)
         .receive("ok",    response => {console.log("New game started!",         response)})
         .receive("error", response => {console.log("Failed to start new game.", response)}) */
/* {
  event: "new_game",
  channel: Channel,
  payload: {}
} */

// DEPRECATED: join now handles functionality
// export const add_player = (channel, player) =>
// channel        event      payload
  // channel.push("add_player", player)
  //        .receive("error", response => {console.log(`Could not add new player: ${player}`, response)})
/* {
  event: "add_player",
  channel: Channel,
  payload: player
} */
// .on defines event listener
//                  event     callback (handler)
// game_channel.on("player_added", response => {console.log("Player added", response)})

export const place_island = (channel, player, island, row, col) =>
  channel.push("place_island", {player, island, row, col})
         .receive("ok",    response => {console.log("Island placed.",          response)})
         .receive("error", response => {console.log("Could not place island.", response)})

export const set_islands = (channel, player) =>
  channel.push("set_islands", player)
         .receive("ok",    response => {console.log("Board:"); console.dir(response.board);})
         .receive("error", response => {console.log(`Failed to set ${player}'s island.`)})
// game_channel.on("islands_set", response => {console.log("Player has set all islands", response)})

export const guess_coordinate = (channel, player, row, col) =>
  channel.push("guess_coordinate", {player, row, col})
         .receive("error", response => {console.log(`${player} could not guess.`, response)})
// game_channel.on("guessed_coordinate", response => {console.log("Player made guess:", response.result)})

export const exit = (channel) =>
  channel.exit()
         .receive("ok",    response => {console.log("Exited channel",         response)})
         .receive("error", response => {console.log("Failed to exit channel", response)})

// .on not working... valid method, though
// export const handle = (channel) =>
//   channel.on("player_added", response => {console.log("Player added", response)})
//          .on("islands_set", response => {console.log("Player has set all islands", response)})
//          .on("guessed_coordinate", response => {console.log("Player made guess:", response.result)})
//          .on("subscribers", response => {console.log("Current players online:", response)})

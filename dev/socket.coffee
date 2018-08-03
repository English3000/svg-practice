###
CoffeeScript vs JavaScript tradeoffs
+ no const, let                  - different string interpolation syntax
+ less {} and ()                 - {} not allowed after => functions
+ () not required to invoke fn   - different instance function syntax, : ->
                                 - worse JSX coloring & linting
                                 - still requires export & import

In all, CoffeeScript removes JavaScript's less meaningful syntax,
but unfortunately requires some of its own.

Plus, there isn't really much of a community.

Additionally, exporting from files still isn't as clean as Elixir.

In all, the question is are the gains from CoffeeScript worth whatever the troubles.

It gives better JS syntax but less polished JSX.

In all, for JSX, I may stick with JavaScript? And for JS logic, CoffeeScript?
###

# TODO: Wrap functionality w/in React Native Web components (a la demo front end provided)
import {Socket} from "phoenix-socket" # https://hexdocs.pm/phoenix/js/
socket = new Socket("ws://localhost:4000/socket", {})
# SOCKET
### {
  channels: [],
  conn: WebSocket,
  ...
} ###
socket.connect()
export default socket

# game_channel.on("subscribers", response => {console.log("Current players online:", response)})
  # To see, in browser console, copy, paste, then type: game_channel.push("show_subscribers")

export join_game = (socket, game, player) =>
  socket.channel("game:" + game, {screen_name: player}).join()
        .receive("ok",    response => console.log("Joined channel!", response); return response)
        .receive("error", response => console.log response.reason)
### {
  event: "phx_join",
  channel: Channel,
  payload: Channel.params
} ###
# join(game_channel)

# Create a channel event function for each handle_in/3 clause in the GameChannel.
# DEPRECATED: join now handles functionality
### export new_game = (channel) =>
  channel.push("new_game", channel.params.screen_name)
         .receive("ok",    response => {console.log("New game started!",         response)})
         .receive("error", response => {console.log("Failed to start new game.", response)}) ###
### {
  event: "new_game",
  channel: Channel,
  payload: {}
} ###

# DEPRECATED: join now handles functionality
# export add_player = (channel, player) =>
# channel        event      payload
  # channel.push("add_player", player)
  #        .receive("error", response => {console.log(`Could not add new player: ${player}`, response)})
### {
  event: "add_player",
  channel: Channel,
  payload: player
} ###
# .on defines event listener
#                  event     callback (handler)
# game_channel.on("player_added", response => {console.log("Player added", response)})

export place_island = (channel, player, island, row, col) =>
  channel.push("place_island", {player, island, row, col})
         .receive("ok",    response => console.log("Island placed.",          response))
         .receive("error", response => console.log("Could not place island.", response))

export set_islands = (channel, player) =>
  channel.push("set_islands", player)
         .receive("ok",    response => console.log("Board:"); console.dir(response.board))
         .receive("error", response => console.log("Failed to set #{player}'s island."))
# game_channel.on("islands_set", response => {console.log("Player has set all islands", response)})

export guess_coordinate = (channel, player, row, col) =>
  channel.push("guess_coordinate", {player, row, col})
         .receive("error", response => console.log("#{player} could not guess.", response))
# game_channel.on("guessed_coordinate", response => {console.log("Player made guess:", response.result)})

export exit = (channel) =>
  channel.exit()
         .receive("ok",    response => console.log("Exited channel",         response))
         .receive("error", response => console.log("Failed to exit channel", response))

# .on not working... valid method, though
# export handle = (channel) =>
#   channel.on("player_added", response => {console.log("Player added", response)})
#          .on("islands_set", response => {console.log("Player has set all islands", response)})
#          .on("guessed_coordinate", response => {console.log("Player made guess:", response.result)})
#          .on("subscribers", response => {console.log("Current players online:", response)})

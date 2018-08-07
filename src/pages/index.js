import React from "react"
import socket from "../socket"

// Component hierarchy
<View key="game">
  {/* this.state = { // setup handlers (to properly interact w/ state)

  }
      // How do I know which player is which?
      // By the one that has a board.
      render() {
        socket.channels[0].on("game_joined",
          ({game, rules, player1, player2}) => this.setState({game, rules, player1, player2}))
      }
  */}
  <View key="form">
    {/* this.state = { game: "",
                       player: "" } */}
    {/* onSubmit => join_game(socket, game, player) */}
  </View>

  <View key="instructions">
    {/* this.state = { error: null,
                       instruction: null }

    Error listeners for all `socket.js` methods */}
    <Text>{error ? error : instruction}</Text>
  </View>

  <View key="board">
    {/* DROP AREA: https://dev.to/hyra/getting-started-with-the-panresponder-in-react-native-9mf
          ~ generated from player board
      onDrop??={}
    */}
  </View>
  <View key="islands">
    {/* this.state = {
          unset: 5
        } */}
    {unset > 0 ?
      <View>{/* DRAGGABLE ISLANDS */}</View> :
      <Button key="set-islands"></Button>}
  </View>
</View>

// export default class Game extends React.Component{
//
// }

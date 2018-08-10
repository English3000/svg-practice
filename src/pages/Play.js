// need to consider crash handling...
componentDidMount(){ // won't have access to a channel until game is joined
  if (socket.channels.length > 0)
    socket.channels[0].on("game_joined", ({game, rules, player1, player2}) => this.setState({game, rules, player1, player2}))
}

player1.board ?
  <View>
    <Board/> {/* incl. Islands */}
    <Guesses/>
  </View> :
  <View>
    <Guesses/>
    <Board/>
  </View>


<View key="board">
  {/* DROP AREA: https://dev.to/hyra/getting-started-with-the-panresponder-in-react-native-9mf */}
</View>
<View key="islands">
  {/* this.state = {
    unset: 5
  } */}
  {unset > 0 ?
    <View>{/* DRAGGABLE ISLANDS */}</View> :
    <Button key="set-islands"></Button>}
</View>

<View key="guesses">
  {/* displays my guesses */}
</View>

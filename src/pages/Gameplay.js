
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

import React from "react"
import { View } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary.js"
import Board from "./components/Board.js"
import styles from "./index.js"
// probably will move board logic up here so have access to
const renderBoards = ({game, player}) => (
  player === "player1" ? // player1 is always on left

    [ <Board key="me"       islands={game[player].islands} stage={game[player].stage}/> ,
      <Board key="opponent" guesses={game[player].guesses}/> ] :

    [ <Board key="opponent" guesses={game[player].guesses}/> ,
      <Board key="me"       islands={game[player].islands} stage={game[player].stage}/> ]
)

export default (props) =>
  <ErrorBoundary>
    <View key="display" style={styles.row}>
      {renderBoards(props)}
    </View>
  </ErrorBoundary>

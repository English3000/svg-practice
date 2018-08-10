import React from "react"
import { View } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary.js"
import Board from "./components/Board.js"

const renderBoards = ({game, player}) => (
  game[player].stage === "turn" ?
    <Board guesses={game[player].guesses}/> :
    <Board islands={game[player].islands} stage={game[player].stage}/>
)

// is there a way to transition between boards on re-rendering?
export default (props) =>
  <ErrorBoundary>
    {renderBoards(props)}
  </ErrorBoundary>

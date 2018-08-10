import React from "react"
import { View } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary.js"

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

const renderBoard = ({islands, stage}) => (
  [ <View key="my-board">
      {islands}
    </View> ,

    stage === "joined" ?
      renderIslandSet() : null ]
)
const renderDisplay = (props) => (
  props.guesses ?
    <View key="opponent-board">
      {props.guesses}
    </View> :

    renderBoard(props)
)
export default (props) =>
  <ErrorBoundary>
    {renderDisplay(props)}
  </ErrorBoundary>

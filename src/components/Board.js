import React from "react"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg from "react-native-svg"
import { height, width, board } from "./Shape.js"

export default (props) =>
  <ErrorBoundary>
    <Svg width={width} height={height}>
      {board(10)}
      {guesses(props.guesses)}
      {props.islands ?
        islands(props.islands, props.stage, props.player) : null}
    </Svg>
  </ErrorBoundary>

import React from "react"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg from "react-native-svg"
import { height, width, board, renderTiles } from "./Shape.js"
// how to efficiently render island coords, && guessed hits && misses:
//  _.reject coords that are hits
export default (props) =>
  <ErrorBoundary>
    <Svg width={width} height={height}>
      {board(10)}
      {props.islands ?
        islands(props.islands, props.attackable, props.player) : null}
      {renderTiles(props.guesses, )}
    </Svg>
  </ErrorBoundary>

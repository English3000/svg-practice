import React from "react"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg from "react-native-svg"
import { height, width, board, renderTiles } from "./Tile.js"
import _ from "underscore"

const filter = (island, hits) => // Does app render faster?
  _.reject(island, coord => hits.includes(coord))

export default (props) =>
  <ErrorBoundary>
    <Svg width={width} height={height}>
      {board(10)}
      {props.islands ?
        _.map(Object.values(props.islands), island =>
          renderTiles(filter(island), "brown", props.attackable, props.player)) : null}
      {renderTiles(props.guesses.hits, "green")}
      {renderTiles(props.guesses.misses, "gray")}
    </Svg>
  </ErrorBoundary>

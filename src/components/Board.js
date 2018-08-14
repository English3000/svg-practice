import React from "react"
import { Platform} from "react-native-web"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg from "react-native-svg"
import { height, width, board, renderTiles } from "./Tile.js"
import _ from "underscore"

const filter = (island, hits) => // Does app render faster?
  _.reject(island, coord => hits.includes(coord))

export default (props) =>
  <ErrorBoundary>
    <Svg width={Platform.OS === "web" ? width/2 : width} height={height}>
      {board(10, props.attackable ? props.player : null)}
      {props.islands ?
        _.map(Object.values(props.islands), island =>
          renderTiles(filter(island), "brown")) : null}
      {renderTiles(props.guesses.hits, "green")}
      {renderTiles(props.guesses.misses, "gray")}
    </Svg>
  </ErrorBoundary>

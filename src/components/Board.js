import React from "react"
import { Platform} from "react-native-web"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg from "react-native-svg"
import { height, width, board, renderTiles } from "./Tile.js"
import _ from "underscore"
/*
function renderButtons(size, guesses, islands){
  // if an island is placed, the whole board re-renders
}

export default (props) =>
  <ErrorBoundary>
    {renderButtons(10, props.guesses, props.attackable ? null : props.islands)}
  </ErrorBoundary>
*/

const filter = (island, hits) => // Does app render faster?
  _.reject(island, coord => hits.includes(coord))
// Refactor; Svgs have no `onPress`
export default (props) =>
  <ErrorBoundary>
    <Svg width={Platform.OS === "web" ? width/2 : width} height={height}>
      {board(10, props.attackable ? props.player : null)}
      {props.islands ?
        _.map(Object.values(props.islands), island =>
          renderTiles(filter(island, props.guesses.hits), "tile", "brown")) : null}
      {renderTiles(props.guesses.hits, "hit", "green")}
      {renderTiles(props.guesses.misses, "miss", "gray")}
    </Svg>
  </ErrorBoundary>

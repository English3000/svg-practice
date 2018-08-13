import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary"
import Svg, {Text, Rect} from "react-native-svg" // cross-platform

// https://github.com/godaddy/svgs#install
// npm i -S svgs
// ⌘ + T webpack.config.js
// alias: {'react-native-svg': 'svgs',}

import _ from "underscore"

export const {height, width} = Dimensions.get("window")
const bound = height > width ? width-0.5 : height-0.5

export const unit  = multiple => bound/10 * multiple

export const coords = { // add bounds/dimensions
  atoll: [[0,0],[0,1],
                [1,1],
          [2,0],[2,1]],

  dot: [[0,0]],

  l: [[0,0],
      [1,0],
      [2,0],[2,1]],

  s: [      [0,1],[0,2],
      [1,0],[1,1]      ],

  square: [[0,0],[0,1],
           [1,0],[1,1]]
}

export const islands(islands, stage, player) => // * make more efficient *
               _.map(islands, island => island(island.coordinates))
               _.map(islands, island => island(island.hits, true))

export const island = (coords, hit = false, row = 0, col = 0) =>
               _.map(coords, coord =>
                 <Tile key={`board(${row+coord[0]},${col+coord[1]})`}
                       x={unit(col + coord[1])}
                       y={unit(row + coord[0])}
                       fill={hit ? "green" : "brown"}/>)


export const board = (size) =>
               _.map(_.range(size), x =>
                 _.map(_.range(size), y =>
                   <Tile key={`island(${x},${y})`}
                         x={`${unit(x)}`} data-row={x}
                         y={`${unit(y)}`} data-col={y}
                         fill="blue"/>))

const Tile = props => // add onPress handler (sends guess to backend)
  <Rect x={`${props.x}`} width={`${unit(1)}`}  data-row={props.x}
        y={`${props.y}`} height={`${unit(1)}`} data-col={props.y}
        stroke="black"   fill={props.fill}/>

export default ({type, coords, row, col}) => (
  <ErrorBoundary>
    <Svg width={unit(bounds.width)} height={unit(bounds.height)}>
      {island(coords, row, col)}
    </Svg>
  </ErrorBoundary>
)

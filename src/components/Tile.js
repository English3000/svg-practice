import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg, {Text, Rect} from "react-native-svg" // cross-platform -- alias: {'react-native-svg': 'svgs',}
import socket, { guess_coordinate } from "../socket.js"
import _ from "underscore"

export const {height, width} = Dimensions.get("window")
const bound = height > width ? width-0.5 : height-0.5
const unit  = multiple => bound/10 * multiple

export const islands = {
  atoll: { coords: [[0,0],[0,1],
                          [1,1],
                    [2,0],[2,1]],
           bounds: {width: unit(2), height: unit(3)} },

  dot: { coords: [[0,0]],
         bounds: {width: unit(1), height: unit(1)} },

  L: { coords: [[0,0],
                [1,0],
                [2,0],[2,1]],
       bounds: {width: unit(2), height: unit(3)} },

  S: { coords: [      [0,1],[0,2],
                [1,0],[1,1]      ],
       bounds: {width: unit(3), height: unit(2)} },

  square: { coords: [[0,0],[0,1],
                     [1,0],[1,1]],
            bounds: {width: unit(2), height: unit(2)} }
}

export const renderTiles = (coords, fill, attackable = false, player = null) =>
               _.map(coords, coord => tile(coord, fill, attackable, player))

const tile = (coords, fill, attackable, player) =>
  <ErrorBoundary>
    <Tile key={`tile(${coords[1]},${coords[0]})`}
          x={unit(coords[1])}
          y={unit(coords[0])}
          fill={fill}
          onPress={() => attackable ? guess_coordinate(socket.channels[0], player, coord.row, coord.col) : null }/>
  </ErrorBoundary>

export const board = (size) =>
               _.map(_.range(size), x =>
                 _.map(_.range(size), y =>
                   <Tile key={`board(${x},${y})`}
                         x={unit(x)}
                         y={unit(y)}
                         fill="blue"/>))

const Tile = ({x, y, fill, onPress}) =>
  <Rect x={`${x}`}  width={`${unit(1)}`}  data-row={`${x}`}
        y={`${y}`}  height={`${unit(1)}`} data-col={`${y}`}
        fill={fill} stroke="black"        onPress={onPress}/> //no onPress

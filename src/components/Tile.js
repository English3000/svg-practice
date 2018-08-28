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

export const renderTiles = (coords, key, fill) =>
               _.map(coords, coord => tile(coord, key, fill))

const tile = (coords, key, fill) =>
  <Tile key={`${key}(${coords[1]},${coords[0]})`}
        x={unit(coords[1])}
        y={unit(coords[0])}
        fill={fill}/>

// REFACTOR: Svgs have no `onPress`, so render as Buttons
// Can use similar drag+drop logic to game.jsx

// What's the most efficient way to not render board tiles that have been attacked?
//  (0) Render hits && misses
//  (1) For each board tile, check if already rendered (using map)
export const board = (size, player) => // hits, misses
               _.map(_.range(size), x =>
                 _.map(_.range(size), y =>
                   <Tile key={`board(${x},${y})`} fill="blue"
                         x={unit(x)}              y={unit(y)}
                         onPress={() => player ? guess_coordinate(socket.channels[0], player, x, y) : null }/>))

const Tile = ({x, y, fill}) =>
  <Rect x={`${x}`}  width={`${unit(1)}`}
        y={`${y}`}  height={`${unit(1)}`}
        fill={fill} stroke="black"/> //no onPress

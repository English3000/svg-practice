import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary"
import Svg, {Text, Rect} from "react-native-svg" // cross-platform

// https://github.com/godaddy/svgs#install
// npm i -S svgs
// ⌘ + T webpack.config.js
// alias: {'react-native-svg': 'svgs',}

import _ from "underscore"

const {height, width} = Dimensions.get("window")

const bound = height > width ? width-0.5 : height-0.5
const unit  = multiple => bound/10 * multiple

const dot    = [[0,0]]

const square = [[0,0],[0,1],
                [1,0],[1,1]]

const atoll  = [[0,0],[0,1],
                      [1,1],
                [2,0],[2,1]]

const l      = [[0,0],
                [1,0],
                [2,0],[2,1]]

const s      = [      [0,1],[0,2],
                [1,0],[1,1]      ]

const island = (coords, row = 0, col = 0) =>
        _.map(coords, coord =>
          <Tile key={`board(${row+coord[0]},${col+coord[1]})`}
                x={unit(col + coord[1])}
                y={unit(row + coord[0])}
                fill="brown"/>)


const board = (size) =>
        _.map(_.range(size), x =>
          _.map(_.range(size), y =>
            <Tile key={`island(${x},${y})`}
                  x={`${unit(x)}`} data-row={x}
                  y={`${unit(y)}`} data-col={y}
                  fill="blue"/>))

const Tile = props =>
  <Rect x={`${props.x}`} width={`${unit(1)}`}  data-row={props.x}
        y={`${props.y}`} height={`${unit(1)}`} data-col={props.y}
        stroke="black"   fill={props.fill}/>

export default class Board extends React.Component {
  render(props) {
    return (
      <ErrorBoundary>
        <View key="padding" style={{paddingTop: 24.5}}></View>
        <View key="board" style={custom.screen}>
          <Svg width={`${bound+0.5}`} height={`${bound+0.5}`}>{[
            board(10),
            props.visible ? props.islands : null,
            props.guesses
          ]}</Svg>
        </View>
      </ErrorBoundary>
    )
  }
}

const custom = StyleSheet.create({
  screen: {
    borderColor: "black",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
})

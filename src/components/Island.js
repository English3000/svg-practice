import React from "react"
import { Dimensions, PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg, { Rect } from "react-native-svg"
import socket, { place_island, delete_island } from "../socket.js"
import _ from "underscore"

export const { height, width } = Dimensions.get("window")
const bound = height > width ? (width-0.5) * 0.6 : (height-0.5) * 0.6
export const unit = multiple => bound/10 * multiple

const islands = {
  atoll: { bounds: {width: unit(2), height: unit(3)},
           coords: [ {row: 0, col: 0}, {row: 0, col: 1},
                                       {row: 1, col: 1},
                     {row: 2, col: 0}, {row: 2, col: 1} ] },

  dot: { bounds: {width: unit(1), height: unit(1)},
         coords: [{row: 0, col: 0}] },

  L: { bounds: {width: unit(2), height: unit(3)},
       coords: [ {row: 0, col: 0},
                 {row: 1, col: 0},
                 {row: 2, col: 0}, {row: 2, col: 1} ] },

  S: { bounds: {width: unit(3), height: unit(2)},
       coords: [                  {row: 0, col: 1}, {row: 0, col: 2},
                {row: 1, col: 0}, {row: 1, col: 1}                  ] },

  square: { bounds: {width: unit(2), height: unit(2)},
            coords: [ {row: 0, col: 0}, {row: 0, col: 1},
                      {row: 1, col: 0}, {row: 1, col: 1} ] }
}

export default class Island extends React.Component{
  constructor(){
    super()        // defaults to {x: 0, y: 0}
    this.state = { pan: new Animated.ValueXY() }
    this.panResponder = {}
  }

  render(){
    let [minX, minY] = [0, 0]
    let {coords, bounds} = islands[this.props.type]
    if (this.props.coords) {
      coords = this.props.coords
      minX = coords[0].col
      minY = coords[0].row
    }

    if (this.props.type === "S" && this.props.player === "player1") minY-- // offset

    return ( // onDrag, island appears UNDERNEATH board
      <ErrorBoundary>
        <Animated.View style={[{transform: this.state.pan.getTranslateTransform(), margin: 5}, this.props.style ? this.props.style : {}]}
                       {...this.panResponder.panHandlers}>
          <Svg width={bounds.width} height={bounds.height}>
            {_.map( coords, coord =>
              <Rect x={`${unit(coord.col - minX)}`}  width={`${unit(1)}`}
                    y={`${unit(coord.row - minY)}`}  height={`${unit(1)}`}
                    fill="brown"                    stroke="black"
                    key={`${this.props.type}(${coord.row},${coord.col})`}/> )}
          </Svg>
        </Animated.View>
      </ErrorBoundary>
    )
  }

  componentDidMount(){
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([ null, { dx: this.state.pan.x,
                                                   dy: this.state.pan.y } ]),
      onPanResponderRelease: (event) => { console.log(event);
        const [row, col] = [this.locate(this.state.pan.x), this.locate(this.state.pan.y)]
        if (row /* condition */ && col /* condition */) {
          place_island(socket.channels[0], this.props.player, this.props.type, row, col)
            .receive("error", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start) // TypeError b/c not using () =>
            // https://facebook.github.io/react-native/docs/animated#spring
        } else { // unset island
          delete_island(socket.channels[0], this.props.player, this.props.type)
            .receive("ok", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start)
        }
      }
    })
    this.forceUpdate()
  }
  locate(coord){ // location should be derived from board, not island (otherwise it's always relative)
    console.log(coord)
    return coord._value
  }
}

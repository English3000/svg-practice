import React from "react"
import { Dimensions, PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg, { Rect } from "react-native-svg"
import socket, { place_island, delete_island } from "../socket.js"
import _ from "underscore"

export const { height, width } = Dimensions.get("window")
const bound = height > width ? width-0.5 : height-0.5
export const unit = multiple => bound/10 * multiple

const islands = {
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

export default class Island extends React.Component{
  constructor(){
    super()        // defaults to {x: 0, y: 0}
    this.state = { pan: new Animated.ValueXY() }
    this.panResponder = {}
  }

  render(){
    const {coords, bounds} = islands[this.props.type]

    return ( // onDrag, appears UNDERNEATH board
      <ErrorBoundary>
        <Animated.View style={{transform: this.state.pan.getTranslateTransform(), margin: 5}}
                       {...this.panResponder.panHandlers}>
          <Svg width={bounds.width} height={bounds.height}>
            {_.map( coords, coord =>
              <Rect x={`${unit(coord[1])}`}  width={`${unit(1)}`}
                    y={`${unit(coord[0])}`}  height={`${unit(1)}`}
                    fill="brown"             stroke="black"
                    key={`${this.props.type}(${coord[1]},${coord[0]})`}/> )}
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
      onPanResponderRelease: () => {
        const [row, col] = [this.locate(this.state.pan.x), this.locate(this.state.pan.y)]
        if (row /* condition */ && col /* condition */) { // locating depends on styling
          place_island(socket.channels[0], this.props.player, this.props.type, row, col)
            .receive("error", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start) // TypeError b/c not using () =>
            // https://facebook.github.io/react-native/docs/animated#spring
        } else {
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

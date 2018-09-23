import React from "react"
import { Dimensions, PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg, { Rect } from "react-native-svg"
import socket, { place_island, delete_island } from "../socket.js"
import _ from "underscore"

export const { height, width } = Dimensions.get("window")
const bound = height > width ? (width-0.5) * 0.6 : (height-0.5) * 0.6
export const unit = multiple => bound/10 * multiple

export const islands = {
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
  constructor(props){
    super(props)        // defaults to {x: 0, y: 0}
    this.state = { pan: new Animated.ValueXY() }
    this.panResponder = {}
    this.locate = this.locate.bind(this)

    console.log("constructing", props.type);
  }

  render(){
    let [minX, minY] = [0, 0]
    let {coords, bounds} = islands[this.props.type]
    if (this.props.coords) {
      coords = this.props.coords
      minX = coords[0].col
      minY = coords[0].row
    }

    if (this.props.type === "S" && this.props.player === "player1" && this.props.set === true) minY-- // offset

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
    const {pan} = this.state
    const {player, set, type} = this.props

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
      onPanResponderRelease: (event) => {
        const [row, col] = this.locate(pan)

        if (row >= 0 && row <= 9 && col >= 0 && col <= 9) {
          place_island(socket.channels[0], player, type, row + (set && type !== "dot" ? 0 : 1), col + (set && type !== "dot" ? 0 : 1))
            .receive("error", () => Animated.spring(pan, {toValue: {x: 0, y: 0}}).start() )
            // https://facebook.github.io/react-native/docs/animated#spring
        } else { // unset island
          delete_island(socket.channels[0], player, type)
            .receive("ok", () => Animated.spring(pan, {toValue: {x: 0, y: 0}}).start() )
        }
      }
    })

    socket.channels[0].on("island_placed", ({coordinates, type}) => {
      if (this.props.type === type) {
        console.log("timeout");
        setTimeout(() => {}, 0)
        console.log("setState");
        this.setState({ pan: new Animated.ValueXY({ x: coordinates[0].col,
                                                    y: coordinates[0].row - (this.props.type === "S" ? 1 : 0) }) })
      }
    })

    this.forceUpdate()
  }
  locate({x, y}){ // location should be derived from board, not island (otherwise it's always relative)
    let row, col

    if (this.props.set) {
      row = Math.round(this.props.coords[0].row + y._value / unit(1))
      col = Math.round(this.props.coords[0].col + x._value / unit(1))
      if (this.props.type === "S" || this.props.type === "dot") {
        row--
        col--
      }
    } else {
      row = Math.round( (this.props.topLeft + y._value) / unit(1) )

      if (this.props.player === "player1") {
        col = Math.round(x._value / unit(1) - 3) // buffer to left-edge of island
      } else if (this.props.player === "player2") {
        col = Math.round(9 + x._value / unit(1) + 2) // buffer to left-edge of board
      }
    }
    console.log("row:", row);
    console.log("column:", col);
    return [row, col]
  }
}

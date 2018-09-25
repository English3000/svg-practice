import React from "react"
import { Dimensions, PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg, { Rect } from "react-native-svg"
import socket, { place_island, delete_island } from "../socket.js"
import _ from "underscore"

export const { height, width } = Dimensions.get("window")
const bound = height > width ? (width-0.5) * 0.6 : (height-0.5) * 0.6
export const unit = multiple => bound/10 * multiple

export default class Island extends React.Component{
  constructor(props){
    super(props)        // defaults to {x: 0, y: 0}
    this.state = { pan: new Animated.ValueXY() }
    this.panResponder = {}
    this.locate = this.locate.bind(this)

    console.log("constructing", props.island.type);
  }

  render(){
    let {coords, bounds} = this.props.island

    return (
      <ErrorBoundary>
        <Animated.View style={[{transform: this.state.pan.getTranslateTransform(), margin: 5}, this.props.style ? this.props.style : {}]}
                       {...this.panResponder.panHandlers}>
          <Svg width={unit(bounds.width)} height={unit(bounds.height)}>
            {_.map( coords, coord =>
              <Rect x={`${unit(coord.col)}`}  width={`${unit(1)}`}
                    y={`${unit(coord.row)}`}  height={`${unit(1)}`}
                    fill="brown"              stroke="black"
                    key={`${this.props.type}(${coord.row},${coord.col})`}/> )}
          </Svg>
        </Animated.View>
      </ErrorBoundary>
    )
  }

  componentDidMount(){
    const {pan} = this.state

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}])
    })

    this.forceUpdate()
  }

  locate({x, y}){ // NOTE: use for each island when setting them
    let row = Math.round( (this.props.topLeft + y._value) / unit(1) )
    let col

    if (this.props.player === "player1") {
      col = Math.round(x._value / unit(1) - 3) // buffer to left-edge of island
    } else if (this.props.player === "player2") {
      col = Math.round(9 + x._value / unit(1) + 2) // buffer to left-edge of board
    }
    console.log("row:", row);
    console.log("column:", col);
    return [row, col]
  }
}

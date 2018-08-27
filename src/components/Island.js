import React from "react"
import { PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Svg from "react-native-svg"
import { renderTiles } from "./Tile.js"
import socket, { place_island, delete_island } from "../socket.js"

export default class Island extends React.Component{
  constructor(){
    super()        // defaults to {x: 0, y: 0}
    this.state = { pan: new Animated.ValueXY() }
    this.panResponder = {}
  }

  render(){
    return ( // can't move islands
      <ErrorBoundary>
        <Animated.View style={{transform: this.state.pan.getTranslateTransform(), margin: 5}}
                       {...this.panResponder.panHandlers}>
          <Svg width={this.props.bounds.width} height={this.props.bounds.height}>
            {renderTiles(this.props.coords, this.props.player + this.props.type, "brown")}
          </Svg>
        </Animated.View>
      </ErrorBoundary>
    )
  }

  componentDidMount(){ // https://facebook.github.io/react-native/docs/gesture-responder-system.html
    console.log("mounted");
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([ null, { dx: this.state.pan.x,
                                                   dy: this.state.pan.y } ]),
      onPanResponderRelease: () => {
        const [row, col] = [this.locate(this.state.pan.x), this.locate(this.state.pan.y)]
        if (row /* condition */ && col /* condition */) { // locating depends on styling
          place_island(socket.channels[0], this.props.player, this.props.type, row, col)
            // no pid error; springs back on next click...
            .receive("error", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start) // https://facebook.github.io/react-native/docs/animated#spring
        } else {
          delete_island(socket.channels[0], this.props.player, this.props.type)
            .receive("ok", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start)
        }
      }
    })
    this.forceUpdate()
    console.log("updated");
  }
  locate(coord){ // locating depends on styling
    console.log(coord._value)
    return coord._value
    // round value so island lands squarely on tile && is placed on the backend accordingly
  }
}

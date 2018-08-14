import React from "react"
import { PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Shape from "./Shape.js"
import socket, { place_island, delete_island } from "../socket.js"

export default class Island extends React.Component{
  constructor(){
    super()        // defaults to {x: 0, y: 0}
    this.state = { pan: new Animated.ValueXY() }
  }

  componentDidMount(){ // https://facebook.github.io/react-native/docs/gesture-responder-system.html
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([ null, { dx: this.state.pan.x,
                                                   dy: this.state.pan.y } ])
      onPanResponderRelease: () => {
        const [row, col] = [locate(this.state.pan.x), locate(this.state.pan.y)]
        if (row /* condition */ && col /* condition */) {
          place_island(socket.channels[0], props.turn, props.type, row, col)
            .receive("error", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start) // https://facebook.github.io/react-native/docs/animated#spring
        } else {
          delete_island(socket.channels[0], props.turn, props.type)
            .receive("ok", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start)
        }
      }

    })
  }
  locate(coord){
    // round value so island lands squarely on tile && is placed on the backend accordingly
  }

  render(){
    return ( // add margins
      <ErrorBoundary>
        <Animated.View>
          {island(props.coords)}
        </Animated.View>
      </ErrorBoundary>
    )
  }
}

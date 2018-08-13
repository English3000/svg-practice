import React from "react"
import { PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Shape from "./Shape.js"
import socket, { place_island } from "../socket.js"

// Option 2
//   Display an SVG board
//   Make islands SVGs wrapped by Animated.View
//   onPanResponderRelease, send channel event to place or spring island
//     > calculate coordinates from pan.x && pan.y
//   When set islands, re-render IslandSet as non-movable SVGs

// + persistent on crash/exit
// + more realistic gameplay (can't place overlapping islands)
// + minimizes business logic on frontend

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
      onPanResponderRelease: () =>
        place_island(socket.channels[0], props.turn, props.type, locate(this.state.pan.x), locate(this.state.pan.y))
          .receive("error", Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start) // https://facebook.github.io/react-native/docs/animated#spring
    })
  }
  locate(coord){
    // round value so island lands squarely on tile && is placed on the backend accordingly
  }

  render(){
    return (
      <ErrorBoundary>
        <Animated.View>
          {island(props.coords)}
        </Animated.View>
      </ErrorBoundary>
    )
  }
}

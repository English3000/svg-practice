import React from "react"
import { PanResponder, Animated } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary.js"

// I need a board that I can place islands in onDrop
// I need draggable islands that can be moved onto && around the board

// Option 1
//   Display an SVG board
//   Make islands SVGs wrapped by Animated.View
//   When set islands, convert islands to non-movable SVGs,
//     calculating row & col based on where it falls on board (can use division && rounding)

// The issues w/ this approach are
//  (1) the backend has a place_island API
//  (2) which houses collision logic (not set_islands)

// The accordingly solution would be
//  to remove island-placing logic from the backend, and
//  to replace it with island-setting validations.

// PROS && CONS
// + reduces number of channel events && validations
// ? more appropriate separation of concerns
// - on crash, if islands unset, need to reset all

// Option 2
//   Display an SVG board
//   Make islands SVGs wrapped by Animated.View
//   onPanResponderRelease, send channel event to place or spring island
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
    })
  }

  render(){
    return (
      <Animated.View>
        {/* island */}
      </Animated.View>
    )
  }
}

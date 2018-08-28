import React from "react"
import { View, PanResponder, Animated } from "react-native"

export default class Draggable extends React.Component{
  constructor(){
    super()
    this.state = { pan: new Animated.ValueXY() }
    this.panResponder = {}
  }

  render(){
    return <Animated.View {...this.panResponder.panHandlers}
                          style={{transform: this.state.pan.getTranslateTransform(),
                                  backgroundColor: "skyblue",
                                  width: 60,
                                  height: 60,
                                  borderRadius: 30}}/>
  }

  componentDidMount(){
    this._val = {x: 0, y: 0}
    this.state.pan.addListener(coords => this._val = coords)
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => true,
      onPanResponderMove: Animated.event([ null, { dx: this.state.pan.x,
                                                   dy: this.state.pan.y } ])
    })
    this.state.pan.setValue({x: 0, y: 0})
    this.forceUpdate()
  }
}

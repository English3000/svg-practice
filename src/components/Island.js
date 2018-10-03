import React from "react"
import { Dimensions, PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import { Consumer } from "./Gameplay.js"
import Svg, { Rect } from "react-native-svg"
import _ from "underscore"

export const { height, width } = Dimensions.get("window")
export const bound = height > width ? (width-0.5) * 0.6 : (height-0.5) * 0.6
export const unit = multiple => bound/10 * multiple

export default class Island extends React.Component{
  constructor(props){
    super(props)        // defaults to {x: 0, y: 0}
    this.state = { pan: new Animated.ValueXY(), onBoard: -1 }
    this.panResponder = {}
    this.locate = this.locate.bind(this)
  }

  render(){
    return <Consumer>
      { ({game, player}) => {
        let {coordinates, bounds} = game[player].islands[this.props.type]

        return (
          <ErrorBoundary>
            <Animated.View style={[{transform: this.state.pan.getTranslateTransform(), marginLeft: 5, marginBottom: 10}, this.props.style ? this.props.style : {}]}
                           {...this.panResponder.panHandlers}>
              <Svg width={unit(bounds.width)} height={unit(bounds.height)}>
                {_.map( coordinates, coord =>
                  <Rect x={`${unit(coord.col)}`}  width={`${unit(1)}`}
                        y={`${unit(coord.row)}`}  height={`${unit(1)}`}
                        fill="brown"              stroke="black"
                        key={`${this.props.type}(${coord.row},${coord.col})`}/> )}
              </Svg>
            </Animated.View>
          </ErrorBoundary>
        )
      }}
    </Consumer>
  }

  componentDidMount(){
    const {pan} = this.state
    const {type, updateIslands} = this.props

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
      onPanResponderRelease: (event) => {
        const [row, col] = this.locate(pan)
        let onBoard = (row >= 0 && row <= 9 && col >= 0 && col <= 9) ? 1 : -1

        if (onBoard !== this.state.onBoard) this.setState({onBoard})
        updateIslands(type, {row: row + 1, col: col + 1}, (onBoard !== this.state.onBoard) ? onBoard : 0)
      }
    })
    this.forceUpdate()
  }

  locate({x, y}){
    let row = Math.round( (this.props.topLeft + y._value) / unit(1) )
    let col

    if (this.props.player === "player1") {
      col = Math.round(x._value / unit(1) - 3) // buffer to left-edge of island
    } else if (this.props.player === "player2") {
      col = Math.round(9 + x._value / unit(1) + 2) // buffer to left-edge of board
    }

    return [row, col]
  }
}

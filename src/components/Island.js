import React from "react"
import { Dimensions, PanResponder, Animated } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
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
    let {coordinates, bounds, type} = this.props.island
    return (
      <ErrorBoundary>
        <Animated.View style={[{transform: this.state.pan.getTranslateTransform(), marginLeft: 5, marginBottom: 10}, this.props.style ? this.props.style : {}]}
                       {...this.panResponder.panHandlers}>
          <Svg width={unit(bounds.width)} height={unit(bounds.height)}>
            {_.map( coordinates, ({col, row}) =>
              <Rect x={`${unit(col)}`}  width={`${unit(1)}`}
                    y={`${unit(row)}`}  height={`${unit(1)}`}
                    fill="brown"        stroke="black"
                    key={`${type}(${row},${col})`}/> )}
          </Svg>
        </Animated.View>
      </ErrorBoundary>
    )
  }

  componentDidMount(){
    const {x, y} = this.state.pan
    const {island, updateIslands} = this.props

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // via: https://mindthecode.com/getting-started-with-the-panresponder-in-react-native/
      onPanResponderGrant: () => { this.state.pan.setOffset({x: x._value, y: y._value})
                                   this.state.pan.setValue({x: 0, y: 0}) },
      onPanResponderMove: Animated.event([null, {dx: x, dy: y}]),
      onPanResponderRelease: (event) => {
        const {height, width} = island.bounds
        const [row, col] = this.locate(x, y)
        let onBoard = (row >= 0 && row + height <= 10 && col >= 0 && col + width <= 10) ? 1 : -1

        if (onBoard !== this.state.onBoard) this.setState({onBoard})
        updateIslands(island.type, {row: row + 1, col: col + 1}, (onBoard !== this.state.onBoard) ? onBoard : 0)

        this.state.pan.flattenOffset()
      }
    })
    this.forceUpdate()
  }

  locate(x, y){
    const {topLeft, player} = this.props
    let marginLeft = (player === "player1") ? -3 : 11

    let row = (topLeft + y._value + y._offset) / unit(1)
    let col = (x._value + x._offset) / unit(1) + marginLeft

    return [Math.round(row), Math.round(col)]
  }
}

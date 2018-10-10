import React from "react"
import { TouchableOpacity } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import socket, { guess_coordinate } from "../socket.js"

export default class Tile extends React.Component{
  constructor(props){
    super(props)
    this.state = {backgroundColor: props.isIsland ? "brown" : "blue", isTurn: props.isTurn}
  }

  render(){
    const {attacker, row, col, isIsland, style} = this.props,
          {backgroundColor} = this.state
    return <ErrorBoundary>
             <TouchableOpacity style={[style, {backgroundColor}]}
                               onPress={() => ["blue", "brown"].includes(backgroundColor) ?
                                                guess_coordinate(socket.channels[0], attacker, row + 1, col + 1) : null}/>
           </ErrorBoundary>
  }

  componentDidMount(){ // NOTE: Refactor away `+1` offsets (to reduce complexity), then solve island hit bug (if still exists)
    const {attacker, player} = this.props
    socket.channels[0].on("coordinate_guessed", ({player_key, row, col, hit}) => {
      if (hit) {
        if (player === player_key && this.props.row === row - 1 && this.props.col === col - 1) {
          this.setState({backgroundColor: "green"})
        } else if (attacker === player_key && this.props.row === row && this.props.col === col) {
          this.setState({backgroundColor: "green"})
        }
      } else if (attacker === player_key && this.props.row === row - 1 && this.props.col === col - 1) {
        this.setState({backgroundColor: "darkblue"})
      }
    })
  }
}

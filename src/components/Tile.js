import React from "react"
import { TouchableOpacity } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import socket, { guess_coordinate } from "../socket.js"

export default class Tile extends React.Component{
  constructor(props){
    super(props)
    this.state = {backgroundColor: props.isIsland ? "brown" : "blue"}
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

  componentDidMount(){ // NOTE: Refactor away `+1` offsets (to reduce complexity)
    socket.channels[0].on("coordinate_guessed", ({player_key, row, col, hit}) => {
      if (this.props.row === row - 1 && this.props.col === col - 1) console.log(this.props.attacker, player_key, row, col, hit);
      if (this.props.attacker === player_key && this.props.row === row - 1 && this.props.col === col - 1)
        hit ? this.setState({backgroundColor: "green"}) : this.setState({backgroundColor: "darkblue"})
    })
  }
}

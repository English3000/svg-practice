import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import { unit } from "./Island.js"
import socket, { guess_coordinate } from "../socket.js"
// NOTE: Make island squares turn to hits
export default class Tile extends React.Component{
  constructor(props){
    super(props)
    this.state = {status: "unguessed"}
  }

  render(){
    const {attacker, row, col, isIsland} = this.props
    let backgroundColor

    switch (this.state.status) {
      case "unguessed":
        backgroundColor = isIsland ? "brown" : "blue"
        break
      case "hit":
        backgroundColor = "green"
        break
      case "miss":
        backgroundColor = "darkblue"
        break
    }

    return <ErrorBoundary>
             <TouchableOpacity style={[custom.tile, {backgroundColor}]}
                               onPress={() => this.state.status == "unguessed" ?
                                                guess_coordinate(socket.channels[0], attacker, row + 1, col + 1) : null}/>
           </ErrorBoundary>
  }

  componentDidMount(){ // NOTE: Refactor away `+1` offsets (to reduce complexity)
    socket.channels[0].on("coordinate_guessed", ({player_key, row, col, hit}) => {
      if (this.props.row === row - 1 && this.props.col === col - 1) console.log(this.props.attacker, player_key, row, col, hit);
      if (this.props.attacker === player_key && this.props.row === row - 1 && this.props.col === col - 1)
        hit ? this.setState({status: "hit"}) : this.setState({status: "miss"})
    })
  }
}

const custom = StyleSheet.create({
  tile: {width: unit(1), height: unit(1), borderWidth: 0.5}
})

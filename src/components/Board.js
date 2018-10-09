import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { styles } from "../App.js"
import ErrorBoundary from "./ErrorBoundary.js"
import Tile from "./Tile.js"
import { unit } from "./Island.js"
import _ from "underscore"

export default class Board extends React.Component{
  constructor(props){
    super(props)
    this.state = { board: _.map(_.range(10), row =>
                            _.map( _.range(10), col => <Tile key={`tile${row},${col}`}
                                                             style={[custom.tile, {cursor: props.game[props.player].islands ? "pointer" : "default"}]}
                                                             row={row}
                                                             col={col}
                                                             attacker={props.player}/> )),
                   mounted: false }
  }

  render(){
    const {game, player} = this.props
    return this.state.mounted ?
      <ErrorBoundary>
        <View style={{marginHorizontal: unit(1), borderWidth: 0.5}}>
          {_.map( this.state.board, (row, i) =>
            <View key={i} style={styles.row}>{row}</View> )}
        </View>
      </ErrorBoundary> : null
  }

  componentDidMount(){
    let {board} = this.state,
        {game, player} = this.props

    const attacker = game[player],
          owner = (player === "player1") ? game["player2"] : game["player1"]

    if (owner.islands) { // BUG: on opp attack, island is not updated
      _.each(Object.values(owner.islands), island =>
        _.each( island.coordinates, coord =>
          board[coord.row - 1][coord.col - 1] = <Tile key={`island${coord.row},${coord.col}`}
                                                      style={[custom.tile, {cursor: "default"}]}
                                                      row={coord.row}
                                                      col={coord.col}
                                                      attacker={player}
                                                      isIsland={true}/> )) }
    _.each( attacker.guesses.hits, coord =>
      board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`hit${coord.row},${coord.col}`}>
                                              <TouchableOpacity style={[custom.tile, {backgroundColor: "green", cursor: "default"}]}/>
                                            </ErrorBoundary> )
    _.each( attacker.guesses.misses, coord =>
      board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`miss${coord.row},${coord.col}`}>
                                              <TouchableOpacity style={[custom.tile, {backgroundColor: "darkblue", cursor: "default"}]}/>
                                            </ErrorBoundary> )

    this.setState({board, mounted: true})
  }
}

const custom = StyleSheet.create({
  tile: {width: unit(1), height: unit(1), borderWidth: 0.5}
})

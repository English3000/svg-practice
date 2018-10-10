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

    const cursor = props.game[props.attacker].islands ? "pointer" : "default"
    this.state = { board: _.map(_.range(10), row =>
                            _.map( _.range(10), col =>
                              <Tile key={`tile${row},${col}`}
                                    style={[custom.tile, {cursor}]}
                                    row={row}
                                    col={col}
                                    attacker={props.attacker}
                                    player={props.player}/> )),
                   mounted: false }
  }

  render(){
    console.log("render board");
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
        {game, attacker, player} = this.props

    const enemy = game[attacker],
          owner = (attacker === "player1") ? game["player2"] : game["player1"]

    if (owner.islands && owner.stage !== "joined") {
      _.each(Object.values(owner.islands), island =>
        _.each( island.coordinates, coord =>
          board[coord.row - 1][coord.col - 1] = <Tile key={`island${coord.row},${coord.col}`}
                                                      style={[custom.tile, {cursor: "default"}]}
                                                      row={coord.row}
                                                      col={coord.col}
                                                      attacker={attacker}
                                                      player={player}
                                                      isIsland={true}/> )) }
    _.each( enemy.guesses.hits, coord =>
      board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`hit${coord.row},${coord.col}`}>
                                              <TouchableOpacity style={[custom.tile, {backgroundColor: "green", cursor: "default"}]}/>
                                            </ErrorBoundary> )
    _.each( enemy.guesses.misses, coord =>
      board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`miss${coord.row},${coord.col}`}>
                                              <TouchableOpacity style={[custom.tile, {backgroundColor: "darkblue", cursor: "default"}]}/>
                                            </ErrorBoundary> )

    this.setState({board, mounted: true})
  }
}

const custom = StyleSheet.create({
  tile: {width: unit(1), height: unit(1), borderWidth: 0.5}
})

import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { styles } from "../App.js"
import { Consumer } from "./Gameplay.js"
import ErrorBoundary from "./ErrorBoundary.js"
import Tile from "./Tile.js"
import { unit } from "./Island.js"
import _ from "underscore"

export default ({id}) =>
  <Consumer>
    { ({game}) => {
      const attacker = game[id]
      const owner = (id === "player1") ? game["player2"] : game["player1"]

      let board = _.map(_.range(10), row =>
                    _.map( _.range(10), col => <Tile key={`tile${row},${col}`}
                                                     row={row}
                                                     col={col}
                                                     attacker={id}/> )
                  )

      if (owner.islands) { // BUG: on attack, island is not updated
        _.each(Object.values(owner.islands), island =>
          _.each( island.coordinates, coord =>
            board[coord.row - 1][coord.col - 1] = <Tile key={`island${coord.row},${coord.col}`}
                                                        row={coord.row}
                                                        col={coord.col}
                                                        attacker={id}
                                                        isIsland={true}/> )) }
      _.each( attacker.guesses.hits, coord =>
        board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`hit${coord.row},${coord.col}`}>
                                                <TouchableOpacity style={[custom.tile, {backgroundColor: "green"}]}/>
                                              </ErrorBoundary> )
      _.each( attacker.guesses.misses, coord =>
        board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`miss${coord.row},${coord.col}`}>
                                                <TouchableOpacity style={[custom.tile, {backgroundColor: "darkblue"}]}/>
                                              </ErrorBoundary> )

      console.log("render board"); // re-rendering on guess??
      return <ErrorBoundary>
               <View style={{marginHorizontal: unit(1), borderWidth: 0.5}}>
                 {_.map( board, (row, i) =>
                   <View key={i} style={styles.row}>{row}</View> )}
               </View>
             </ErrorBoundary>
    } }
  </Consumer>

const custom = StyleSheet.create({
  tile: {width: unit(1), height: unit(1), borderWidth: 0.5}
})

import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { styles } from "../App.js"
import { Consumer } from "./Gameplay.js"
import ErrorBoundary from "./ErrorBoundary.js"
import Island, { unit } from "./Island.js"
import socket, { guess_coordinate } from "../socket.js"
import _ from "underscore"

export default ({id}) =>
  <Consumer>
    { ({game, player}) => {
      console.log("render board");

      const attacker = game[id]
      const owner = (id === "player1") ? game["player2"] : game["player1"]

      let board = _.map(_.range(10), row =>
                    _.map(_.range(10), col =>
                      <ErrorBoundary key={`${row},${col}`}>
                        <TouchableOpacity style={[custom.tile, {backgroundColor: "blue"}]}
                                          onPress={() => attacker.stage === "turn" &&
                                                         attacker.key === player ?
                                                           guess_coordinate(socket.channels[0], id, row, col) : null}/>
                      </ErrorBoundary>
                    )
                  )

      if (owner.stage !== "joined" && owner.islands) {
        _.each(Object.values(owner.islands), island =>
          _.each( island.coordinates, coord =>
            board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`${coord.row},${coord.col}`}>
                                                    <TouchableOpacity style={[custom.tile, {backgroundColor: "brown"}]}/>
                                                  </ErrorBoundary> ))
        _.each( attacker.guesses.hits, coord =>
          board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`${coord.row},${coord.col}`}>
                                                  <TouchableOpacity style={[custom.tile, {backgroundColor: "green"}]}/>
                                                </ErrorBoundary> )
        _.each( attacker.guesses.misses, coord =>
          board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`${coord.row},${coord.col}`}>
                                                  <TouchableOpacity style={[custom.tile, {backgroundColor: "gray"}]}/>
                                                </ErrorBoundary> ) }

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

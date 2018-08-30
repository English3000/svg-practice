import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { styles } from "../App.js"
import ErrorBoundary from "./ErrorBoundary.js"
import { unit } from "./Island.js"
import socket, { guess_coordinate } from "../socket.js"
import _ from "underscore"

export default (props) => {
  let board = _.map(_.range(10), row =>
                _.map(_.range(10), col =>
                  <ErrorBoundary key={`${row},${col}`}>
                    <TouchableOpacity style={[custom.tile, {backgroundColor: "blue"}]}
                                      onPress={() => props.player ? guess_coordinate(socket.channels[0], props.player, row, col) : null}/>
                  </ErrorBoundary>
                )
              )

  if (props.islands) { // if frontend crashes while placing islands, can't re-place
    _.each(Object.values(props.islands), island =>
      _.each( island.coordinates, coord =>
        board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`${coord.row},${coord.col}`}>
                                                <TouchableOpacity style={[custom.tile, {backgroundColor: "brown"}]}/>
                                              </ErrorBoundary> )) }
  _.each( props.guesses.hits, coord =>
    board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`${coord.row},${coord.col}`}>
                                            <TouchableOpacity style={[custom.tile, {backgroundColor: "green"}]}/>
                                          </ErrorBoundary> )
  _.each( props.guesses.misses, coord =>
    board[coord.row - 1][coord.col - 1] = <ErrorBoundary key={`${coord.row},${coord.col}`}>
                                            <TouchableOpacity style={[custom.tile, {backgroundColor: "gray"}]}/>
                                          </ErrorBoundary> )

  return <ErrorBoundary>
           <View style={{marginHorizontal: unit(1), borderWidth: 0.5}}>
             {_.map( board, (row, i) =>
               <View key={i} style={styles.row}>{row}</View> )}
           </View>
         </ErrorBoundary>
}

const custom = StyleSheet.create({
  tile: {width: unit(1), height: unit(1), borderWidth: 0.5}
})

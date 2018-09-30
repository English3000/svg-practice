import React, { Component, createContext } from "react"
import { StyleSheet, Platform, View, TouchableOpacity, Text } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Board from "./Board.js"
import Island, { unit, bound } from "./Island.js"
import { styles } from "../App.js"
import socket, { set_islands } from "../socket.js"
import merge from "lodash.merge"
import _ from "underscore"

export const { Provider, Consumer } = createContext()

const custom = StyleSheet.create({
  web: {position: "absolute", zIndex: 1},

  button: { width: bound,
            backgroundColor: "blue",
            marginTop: 18,
            borderRadius: 15,
            padding: 5,
            paddingBottom: 6.5 },

  buttonText: {textAlign: "center", fontSize: 16.5, fontStyle: "italic"}
})

export default class Gameplay extends Component{
  constructor(props){
    super(props)
    this.renderBoards = this.renderBoards.bind(this)
    this.updateIslands = this.updateIslands.bind(this)
    this.state = merge({onBoard: 0}, props.game[props.player].islands)
  }

  render(){
    const {game, player} = this.props
    return <ErrorBoundary>
             <Provider value={{game, player}}>
               <View key="display"
                     style={{alignItems: "center"}}>
                 {this.renderBoards(this.props)}

                 {this.state.onBoard === 5 && game[player].stage === "joined" ?
                   <TouchableOpacity style={custom.button}
                                     onPress={() => set_islands(socket.channels[0], player, this.state)}>
                     <Text style={custom.buttonText}>SET ISLANDS</Text>
                   </TouchableOpacity> : null}
               </View>
             </Provider>
           </ErrorBoundary>
  }

  renderBoards({game, player}){
    const opp = (player === "player1") ? "player2" : "player1"
    const my = game[player]

    if (Platform.OS !== "web") { // Show player2 board below
      return my.stage === "turn" ? // handle game end; need island hits
               <Board id={player}/> :

             [ <Board id={opp} key="set-islands"/> ,
               this.renderIslandSet(styles.row) ]
    } else { // web
      return [
        (player === "player1") ?
          <View key="me" style={styles.row}>
            {this.renderIslandSet([custom.web, {marginLeft: unit(-2.25)}])}
            <Board id={player} key="opp"/>
            <Board id={opp}/>
          </View> : null,

          (player === "player2") ?
            <View key="me" style={styles.row}>
              <Board id={opp}/>
              <Board id={player} key="opp"/>
              {this.renderIslandSet([custom.web, {marginLeft: unit(12)}])}
            </View> : null ]
    }
  }

  renderIslandSet(style = {}){
    let topLeft = 4

    return <ErrorBoundary>
             <View key="unset-islands" style={style}>
               {_.map( _.pairs(this.state), ([type, island]) => {
                 if (type === "placed" || type === "onBoard") return null

                 height = island ? (unit(island.bounds.height) + 5) : 0 // margin
                 topLeft += height

                 return <Island key={type}
                                type={type}
                                player={this.props.player}
                                topLeft={topLeft - height}
                                updateIslands={this.updateIslands}/> })}
             </View>
           </ErrorBoundary>
  }

  updateIslands(type, top_left, onBoard){
    let island = merge({}, this.state[type], {bounds: {top_left}})
    this.setState({[type]: island, onBoard: this.state.onBoard + (onBoard ? 1 : -1)})
  }
}

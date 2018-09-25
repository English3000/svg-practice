import React, { Component, createContext } from "react"
import { StyleSheet, Platform, View } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Board from "./Board.js"
import Island, { unit } from "./Island.js"
import { styles } from "../App.js"
import socket from "../socket.js"
import merge from "lodash.merge"
import _ from "underscore"

export const { Provider, Consumer } = createContext()

export default class Gameplay extends Component{
  constructor(props) {
    super(props)
    this.renderBoards = this.renderBoards.bind(this)

    const {stage, islands} = props.game[props.player]
    this.state = {unset: stage === "joined" ? islands : []}
  }

  render(){ return <ErrorBoundary>
                     <Provider value={{game: this.props.game, player: this.props.player}}>
                       <View key="display"
                             style={[{justifyContent: "center"}, Platform.OS === "web" ? styles.row : {}]}>
                         {this.renderBoards(this.props)}
                       </View>
                     </Provider>
                   </ErrorBoundary> }

  renderBoards({game, player}){ // NOTE: Add "Set Islands" button
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
            <Board id={opp}/>
          </View> : null,

          <Board id={player} key="opp"/> ,

          (player === "player2") ?
            <View key="me" style={styles.row}>
              <Board id={opp}/>
              {this.renderIslandSet([custom.web, {marginLeft: unit(12)}])}
            </View> : null ]
    }
  }

  renderIslandSet(style = {}){
    const {game, player} = this.props

    let topLeft = 4

    return <ErrorBoundary>
             <View key="unset-islands" style={style}>
               {_.map( this.state.unset, island => {
                 height = unit(island.bounds.height) + 5 // margin
                 topLeft += height

                 return <Island key={type}
                                island={island}
                                player={player}
                                topLeft={topLeft - height}/> })}
             </View>
           </ErrorBoundary>
  }
}

const custom = StyleSheet.create({
  web: {position: "absolute", zIndex: 1}
})

import React, { Component, createContext } from "react"
import { StyleSheet, Platform, View } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Board from "./Board.js"
import Island, { unit } from "./Island.js"
import { styles } from "../App.js"
import socket, { set_islands } from "../socket.js"
import merge from "lodash.merge"
import _ from "underscore"

export const { Provider, Consumer } = createContext()

export default class Gameplay extends Component{
  constructor(){
    super()
    this.renderBoards = this.renderBoards.bind(this)
    this.state = {unset: {}}
  }

  render(){ return <ErrorBoundary>
                     <Provider value={{game: this.props.game, player: this.props.player}}>
                       <View key="display"
                             style={[{justifyContent: "center"}, Platform.OS === "web" ? styles.row : {}]}>
                         {this.renderBoards(this.props)}
                       </View>
                     </Provider>
                   </ErrorBoundary> }

  componentDidMount() {
    const {islands} = this.props.game[this.props.player]
    this.setState({unset: !islands || islands.placed ? {} : islands})
  }

  renderBoards({game, player}){ // NOTE: Add "Set Islands" button w/ channel action
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
    let topLeft = 4

    return <ErrorBoundary>
             <View key="unset-islands" style={style}>
               {_.map( _.pairs(this.state.unset), ([type, island]) => {
                 height = island ? (unit(island.bounds.height) + 5) : 0 // margin
                 topLeft += height

                 return <Island key={type}
                                type={type}
                                player={this.props.player}
                                topLeft={topLeft - height}/> })}
             </View>
           </ErrorBoundary>
  }
}

const custom = StyleSheet.create({
  web: {position: "absolute", zIndex: 1}
})

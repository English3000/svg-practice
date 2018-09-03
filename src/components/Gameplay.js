import React, { Component, createContext } from "react"
import { Platform, View } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Board from "./Board.js"
import Island, { unit } from "./Island.js"
import { styles } from "../App.js"
import _ from "underscore"

export const { Provider, Consumer } = createContext()

const ISLAND_TYPES = ["atoll", "dot", "L", "S", "square"]

export default class Gameplay extends Component{
  constructor(props) {
    super(props)
    this.renderBoards = this.renderBoards.bind(this)

    const islands = props.game[props.player].islands
    const types = islands ? Object.keys(islands) : []
    this.state = { unset: _.reject(ISLAND_TYPES, type => types.includes(type)) }
  } // on "place_island", could make it disappear from IslandSet (@ Island-lv)

  render(){ return <ErrorBoundary>
                     <Provider value={{game: this.props.game, player: this.props.player}}>
                       <View key="display"
                             style={Platform.OS === "web" ? styles.row : {}}>
                         {this.renderBoards(this.props)}
                       </View>
                     </Provider>
                   </ErrorBoundary> }

  renderBoards({game, player}){
    const opp = (player === "player1") ? "player2" : "player1"
    const my = game[player]

    if (Platform.OS !== "web") { // Show player2 board below
      return my.stage === "turn" ? // handle game end; need island hits
               <Board id={player}/> :

             [ <Board id={opp} key="set-islands"/> ,

               my.stage === "joined" ?
                 this.renderIslandSet(styles.row) : null ]
    } else if (player === "player1") { // web
      return [ <View key="me" style={styles.row}>
                 {my.stage === "joined" ?
                   this.renderIslandSet() : null}

                 <Board id={opp}/>
               </View> ,

               <Board id={player} key="opp"/> ]
    } else {
      return [ <Board id={player} key="opp"/> ,

               <View key="me" style={styles.row}>
                 <Board id={opp}/>

                 {my.stage === "joined" ?
                   this.renderIslandSet() : null}
               </View> ]
    }
  }

  renderIslandSet(style = {}){
    const {game, player} = this.props

    return <ErrorBoundary>
             <View key="unset-islands" style={style}>
               {_.map( this.state.unset, type =>
                 <Island key={type}
                         type={type}
                         player={player}/> )}
             </View>
           </ErrorBoundary>
  }
}

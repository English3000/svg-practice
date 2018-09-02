import React from "react"
import { Platform, View } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Board from "./Board.js"
import Island, { unit } from "./Island.js"
import { Consumer, styles } from "../App.js"
import _ from "underscore"

const ISLAND_TYPES = ["atoll", "dot", "L", "S", "square"]

export default class Gameplay extends React.Component{
  constructor(props) {
    super(props)
    this.renderBoards = this.renderBoards.bind(this)

    const islands = props.game[props.player].islands
    const types = islands ? Object.keys(islands) : []
    this.state = { unset: _.reject(ISLAND_TYPES, type => types.includes(type)) }
  } // on "place_island", could make it disappear from IslandSet (@ Island-lv)

  render(){ return <ErrorBoundary>
                     <View key="display" style={styles.row}>
                       {this.renderBoards(this.props)}
                     </View>
                   </ErrorBoundary> }

  renderBoards({game, player}){
    const opp = (player === "player1") ? game["player2"] : game["player1"]
    const my = game[player]
    console.log(my);
    console.log(opp);
    if (Platform.OS !== "web") { // Show player2 board below
      return my.stage === "turn" ? // handle game end; need island hits
               <Board guesses={my.guesses}
                      player={player}/> :

             [ <Board guesses={opp.guesses}
                      islands={my.islands}
                      key="set-islands"/> ,

               my.stage === "joined" ?
                 this.renderIslandSet(styles.row) : null ]
    } else if (player === "player1") { // web
      return [ <View key="me" style={styles.row}>
                 {my.stage === "joined" ? // IslandSet
                   this.renderIslandSet() : null}

                 <Board guesses={opp.guesses}
                        islands={my.islands}
                        player={player}
                        game={game}/>
               </View> ,

               <Board guesses={my.guesses}
                      player={player}
                      key="opp"/> ]
    } else {
      return [ <Board guesses={my.guesses}
                      player={player}
                      key="opp"/> ,

               <View key="me" style={styles.row}>
                 <Board guesses={opp.guesses}
                        islands={my.islands}/>

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

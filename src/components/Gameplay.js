import React from "react"
import { Platform, View } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Board from "./Board.js"
import Island from "./Island.js"
import { islands } from "./Tile.js"
import { Consumer, styles } from "../App.js"
import _ from "underscore"

export const ISLAND_TYPES = ["atoll", "dot", "L", "S", "square"]
// Refactor, using Consumer API 
export default class Gameplay extends React.Component{
  constructor(props) {
    super(props)
    this.renderBoards = this.renderBoards.bind(this)

    const types = Object.keys(props.game[props.player].islands)
    this.state = { unset: _.reject(ISLAND_TYPES, type => types.includes(type)) }
  }

  render(){ return <ErrorBoundary>
                     <View key="display" style={styles.row}>
                       {this.renderBoards(this.props)}
                     </View>
                   </ErrorBoundary> }

  // (0) Debug Island.js, referencing past commits
  renderBoards({game, player}){
    const opp = (player === "player1") ? game["player2"] : game["player1"]
    const my = game[player]
    if (Platform.OS !== "web") {
      return my.stage === "turn" ? // handle game end; need island hits
               <Board guesses={my.guesses}
                      player={player}
                      attackable={my.stage === "turn"}/> :

             [ <Board guesses={opp.guesses}
                      islands={my.islands}
                      attackable={false}
                      key="islands-set"/> ,

               my.stage === "joined" ? // IslandSet; on bottom, absolute -- CAN an object be destructured?
                 <View key="unset-islands" style={styles.row}>
                   {_.map(this.state.unset, type => <Island key={type}
                                                            type={type}
                                                            player={player}
                                                            {...islands[type]}/>)}
                 </View>
               : null ]
    } else if (player === "player1") { // web: player1 is always on left
      return [ <View key="me" style={styles.row}>
                 {my.stage === "joined" ? // IslandSet; on left, absolute
                   <View>
                     {_.map(this.state.unset, type => <Island key={type}
                                                              type={type}
                                                              player={player}
                                                              {...islands[type]}/>)}
                   </View>
                 : null}

                 <Board guesses={opp.guesses}
                        islands={my.islands}
                        attackable={false}/>
               </View> ,

               <Board guesses={my.guesses}
                      attackable={my.stage === "turn"}
                      player={player}
                      key="opp"/> ]
    } else {
      return [ <Board guesses={my.guesses}
                      attackable={my.stage === "turn"}
                      player={player}
                      key="opp"/> ,

               <View key="me" style={styles.row}>
                 <Board guesses={opp.guesses}
                        islands={my.islands}
                        attackable={false}/>

                 {my.stage === "joined" ? // IslandSet; on right, absolute
                   <View>
                     {_.map(this.state.unset, type => <Island key={type}
                                                              type={type}
                                                              player={player}
                                                              {...islands[type]}/>)}
                   </View>
                 : null}
               </View> ]
    }
  }
}
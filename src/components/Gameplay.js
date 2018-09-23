import React, { Component, createContext } from "react"
import { StyleSheet, Platform, View } from "react-native"
import ErrorBoundary from "./ErrorBoundary.js"
import Board from "./Board.js"
import Island, { unit, islands } from "./Island.js"
import { styles } from "../App.js"
import socket from "../socket.js"
import merge from "lodash.merge"
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
  }

  componentDidMount(){
    socket.channels[0].on("island_placed", ({type}) => {
      let {unset} = merge({}, this.state)
      if (unset.includes(type)) {
        unset.splice(unset.indexOf(type), 1)
        this.setState({unset})
      }
    })

    socket.channels[0].on("island_removed", ({type}) => {
      let {unset} = merge({}, this.state)
      if (!unset.includes(type)) this.setState({unset: unset.concat(type)})
    })
  }

  render(){ return <ErrorBoundary>
                     <Provider value={{game: this.props.game, player: this.props.player}}>
                       <View key="display"
                             style={[{justifyContent: "center"}, Platform.OS === "web" ? styles.row : {}]}>
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
                   this.renderIslandSet([custom.web, {marginLeft: unit(-2.25)}]) : null}

                 <Board id={opp}/>
               </View> ,

               <Board id={player} key="opp"/> ]
    } else {
      return [ <Board id={player} key="opp"/> ,

               <View key="me" style={styles.row}>
                 <Board id={opp}/>

                 {my.stage === "joined" ?
                   this.renderIslandSet([custom.web, {marginLeft: unit(12)}]) : null}
               </View> ]
    }
  }

  renderIslandSet(style = {}){
    const {game, player} = this.props

    let topLeft = 4

    return <ErrorBoundary>
             <View key="unset-islands" style={style}>
               {_.map( this.state.unset, type => {
                 height = islands[type].bounds.height + 5 // margin
                 topLeft += height

                 return <Island key={type}
                                set={false}
                                type={type}
                                player={player}
                                topLeft={topLeft - height}/> })}
             </View>
           </ErrorBoundary>
  }
}

const custom = StyleSheet.create({
  web: {position: "absolute", zIndex: 1}
})

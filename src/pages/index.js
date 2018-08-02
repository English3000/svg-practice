import React from "react"

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stage:   null,
                   channel: null,
                   player:  null }
  }

  render(){
    if (!this.state.stage) {
      <Form/>
      <Board visible={true}/><Board visible={false}/>
    } else {
      <View></View>
      <Board/>
      <Islands/>
    }
  }
}

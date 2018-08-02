import React from 'react'
import ReactDOM from 'react-dom'
import Display from './App'
import registerServiceWorker from './registerServiceWorker'
import socket from "./socket"

ReactDOM.render(<Display/>, document.getElementById('root'))
registerServiceWorker()

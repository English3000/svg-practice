import React from 'react';
import ReactDOM from 'react-dom';
import Board from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Board/>, document.getElementById('root'));
registerServiceWorker();

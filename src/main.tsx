import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { SocketIOProvider } from './context/socketIOContext'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <SocketIOProvider>
      <App />
    </SocketIOProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

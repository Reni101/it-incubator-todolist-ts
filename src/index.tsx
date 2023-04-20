import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { store } from './Reducer/store'
import { App } from './app/App'
import { HashRouter } from 'react-router-dom'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
)

serviceWorker.unregister()

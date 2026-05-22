import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import AppRouter from './router/AppRouter'

// Import Bootstrap CSS for base styling structure
import 'bootstrap/dist/css/bootstrap.min.css'
// Import our Premium Dark Theme overrides
import './index.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>,
)

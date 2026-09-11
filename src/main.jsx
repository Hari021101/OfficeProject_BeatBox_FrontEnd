import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import AppRouter from './router/AppRouter'
import ErrorBoundary from './components/common/ErrorBoundary'

// Import Bootstrap CSS for base styling structure
import 'bootstrap/dist/css/bootstrap.min.css'
// Import our Premium Dark Theme overrides
import './index.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Handle unhandled rejections from chrome extensions cleanly
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('A listener indicated an asynchronous response')) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
)

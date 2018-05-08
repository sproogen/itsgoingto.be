import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
import LocaleProvider from 'antd/lib/locale-provider'
import enGB from 'antd/lib/locale-provider/en_GB'
import createStore from 'store/createStore'
import 'styles/main.scss'

// Store Initialization
// ------------------------------------
const store = createStore(window.__INITIAL_STATE__)

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const App = require('./components/App').default
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <CookiesProvider>
      <LocaleProvider locale={enGB}>
        <App store={store} routes={routes} />
      </LocaleProvider>
    </CookiesProvider>,
    MOUNT_NODE
  )
}

// Development Tools
// ------------------------------------
// if (__DEV__) {
//   if (module.hot) {
//     const renderApp = render
//     const renderError = (error) => {
//       const RedBox = require('redbox-react').default

//       ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
//     }

//     render = () => {
//       try {
//         renderApp()
//       } catch (e) {
//         console.error(e)
//         renderError(e)
//       }
//     }

//     // Setup hot module replacement
//     module.hot.accept([
//       './components/App',
//       './routes/index',
//     ], () =>
//       setImmediate(() => {
//         ReactDOM.unmountComponentAtNode(MOUNT_NODE)
//         render()
//       })
//     )
//   }
// }

// Let's Go!
// ------------------------------------
if (process.env.NODE_ENV !== 'test') {
  render()
}

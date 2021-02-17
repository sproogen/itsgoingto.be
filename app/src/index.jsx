import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import LocaleProvider from 'antd/lib/locale-provider'
import enGB from 'antd/lib/locale-provider/en_GB'
import RedBox from 'redbox-react'
import createStore from 'store/create-store'
import App from './container'
import 'styles/main.scss'

// Store Initialization
// ------------------------------------
const store = createStore({})

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

const withProviders = (app) => (
  <CookiesProvider>
    <LocaleProvider locale={enGB}>
      <Provider store={store}>
        {app}
      </Provider>
    </LocaleProvider>
  </CookiesProvider>
)

const render = () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      ReactDOM.render(
        withProviders(<App />),
        MOUNT_NODE
      )
    } catch (e) {
      ReactDOM.render(<RedBox error={e} />, MOUNT_NODE)
    }
  } else {
    ReactDOM.render(
      withProviders(<App />),
      MOUNT_NODE
    )
  }
}

// Let's Go!
// ------------------------------------
if (process.env.NODE_ENV !== 'test') {
  render()
}

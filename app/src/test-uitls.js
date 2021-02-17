import React from 'react'
import { render as rtlRender } from '@testing-library/react' // eslint-disable-line
import { Provider } from 'react-redux'
import createStore from 'store/create-store'

function render(
  ui,
  {
    initialState,
    store = createStore(initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) { // eslint-disable-line
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react' // eslint-disable-line
// override render method
export { render }

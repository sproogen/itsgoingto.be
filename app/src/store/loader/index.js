import { merge } from 'ramda'
import { LOADING_UPDATE, PASSPHRASE_UPDATE } from './constants'

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = {
  loading: false,
  passphrase: false,
}

/**
 * The reducer for this store component
 *
 * @param  {State} state   The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {State}         The modified state
 */
export default function loaderReducer(state = initialState, action = null) {
  switch (action.type) {
    case LOADING_UPDATE:
      return merge(state, { loading: action.loading })
    case PASSPHRASE_UPDATE:
      return merge(state, { passphrase: action.requiresPassphrase })
    default:
      return state
  }
}

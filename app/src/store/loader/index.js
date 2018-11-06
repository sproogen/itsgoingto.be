import { merge } from 'ramda'
import { LOADING_UPDATE, PASSPHRASE_UPDATE } from 'store/loader/actions'

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOADING_UPDATE]    : (previousState, action) => merge(previousState, { loading : action.loading }),
  [PASSPHRASE_UPDATE] : (previousState, action) => merge(previousState, { passphrase : action.requiresPassphrase })
}

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = {
  loading    : false,
  passphrase : false
}

/**
 * The reducer for this store component
 *
 * @param  {State} state   The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {State}         The modified state
 */
export default function loaderReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

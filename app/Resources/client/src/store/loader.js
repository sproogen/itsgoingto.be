import { prop, merge, compose } from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
export const LOADING_UPDATE    = 'LOADING_UPDATE'
export const PASSPHRASE_UPDATE = 'PASSPHRASE_UPDATE'

// ------------------------------------
// Selectors
// ------------------------------------
export const isLoadingSelector = (state) => compose(prop('loading'), prop('loader'))(state)

export const requiresPassphraseSelector = (state) => compose(prop('passphrase'), prop('loader'))(state)

// ------------------------------------
// Actions
// ------------------------------------
export const setLoading = (loading = false) => ({
  type : LOADING_UPDATE,
  loading
})

export const setRequiresPassphrase = (requiresPassphrase = false) => ({
  type : PASSPHRASE_UPDATE,
  requiresPassphrase
})

export const actions = {
  setLoading
}

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

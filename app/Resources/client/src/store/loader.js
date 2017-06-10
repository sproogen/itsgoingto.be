import { prop, compose, not, equals, length, pick, omit, when } from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
export const LOADING_UPDATE = 'LOADING_UPDATE'

// ------------------------------------
// Selectors
// ------------------------------------
export const isLoadingSelector = (state) => prop('loader')(state)

// ------------------------------------
// Actions
// ------------------------------------
export const setLoading = (loading = false) => ({
  type : LOADING_UPDATE,
  loading : loading
})

export const actions = {
  setLoading
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOADING_UPDATE] : (previousState, action) => action.loading
}

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = false

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

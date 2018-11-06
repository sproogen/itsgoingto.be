import { STATS_UPDATE } from './actions'

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // Insert the stats into the state
  [STATS_UPDATE] : (previousState, action) => action.stats,
}

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
export const initialState = {
  polls     : null,
  responses : null,
}

/**
 * The reducer for this store component
 *
 * @param  {object} state  The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {object}        The modified state
 */
export default function statsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

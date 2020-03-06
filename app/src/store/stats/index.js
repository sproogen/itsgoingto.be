import { STATS_UPDATE } from './actions'

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
export const initialState = {
  polls: null,
  responses: null,
}

/**
 * The reducer for this store component
 *
 * @param  {object} state  The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {object}        The modified state
 */
export default function statsReducer(state = initialState, action = null) {
  if (action.type === STATS_UPDATE) {
    return action.stats
  }
  return state
}

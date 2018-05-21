import { prop, compose } from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
export const STATS_UPDATE = 'STATS_UPDATE'

// ------------------------------------
// Selectors
// ------------------------------------
/**
 * Returns a stat from the state
 *
 * @param  {object} state  App state
 * @param  {object} string The stat to select
 *
 * @return {boolean}       The stat
 */
export const statSelector = (state, stat) =>
  compose(
    prop(stat),
    prop('stats')
  )(state)

// ------------------------------------
// Actions
// ------------------------------------
/**
 * Update the stats in the state
 *
 * @param  {object} stats The user data
 *
 * @return {Function}     redux-thunk callable function
 */
export const updateStats = (stats) => ({
  type: STATS_UPDATE,
  stats,
})

/**
 * Clear the stats in the state
 *
 * @return {Function}    redux-thunk callable function
 */
export const clearStats = () => updateStats(initialState)

export const actions = {
  updateStats,
  clearStats,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // Insert the user into the state
  [STATS_UPDATE] : (previousState, action) => action.stats,
}

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = {
  polls:     null,
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
export default function statsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

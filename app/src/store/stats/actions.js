import { STATS_UPDATE } from './constants'

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
export const clearStats = () => updateStats({
  polls: null,
  responses: null,
})

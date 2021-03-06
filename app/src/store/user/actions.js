import { USER_UPDATE } from './constants'

// ------------------------------------
// Actions
// ------------------------------------
/**
 * Update the user in the state
 *
 * @param  {object} user The user data
 *
 * @return {Function}    redux-thunk callable function
 */
export const updateUser = (user) => ({
  type: USER_UPDATE,
  user,
})

/**
 * Clear the user in the state
 *
 * @return {Function}    redux-thunk callable function
 */
export const clearUser = () => updateUser({})

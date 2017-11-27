import { prop, compose, has } from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
export const USER_UPDATE     = 'USER_UPDATE'

// ------------------------------------
// Selectors
// ------------------------------------
/**
 * Returns if there is a user object with a token
 *
 * @param  {object} state App state
 *
 * @return {boolean}      Whether a user exits with a token
 */
export const hasUserSelector = (state) =>
  compose(
    has('token'),
    prop('user')
  )(state)

// ------------------------------------
// Actions
// ------------------------------------
/**
 * Update the user in the state
 *
 * @param  {string}   text       The question text
 * @param  {string}   identifier The poll identifier to update
 *
 * @return {Function}             redux-thunk callable function
 */
export const updateUser = (user) => ({
  type : USER_UPDATE,
  user,
})

export const actions = {
  updateUser,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // Insert the user into the state
  [USER_UPDATE] : (previousState, action) => action.user,
}

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = {}

/**
 * The reducer for this store component
 *
 * @param  {object} state  The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {object}        The modified state
 */
export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

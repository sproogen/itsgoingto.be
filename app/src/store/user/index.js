import { USER_UPDATE } from 'store/user/actions'

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
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_UPDATE:
      return action.user
    default:
      return state
  }
}

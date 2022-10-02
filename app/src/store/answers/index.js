import {
  adjust, compose, not, equals, length, remove, is, merge, find,
  slice, when, subtract, __, map, propEq,
} from 'ramda'
import {
  ANSWER_ADD, ANSWER_UPDATE, ANSWERS_UPDATE, ANSWER_REMOVE, ANSWERS_REMOVE_AFTER, ANSWERS_CLEAR,
} from './constants'

// TODO : Update answers to reference by identifier and index

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = []

/**
 * The reducer for this store component
 *
 * @param  {State} state   The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {State}         The modified state
 */
export default function answersReducer(state = initialState, action = null) {
  switch (action.type) {
    case ANSWER_ADD:
      // Add a new answer to the state
      return [...state, '']
    case ANSWER_UPDATE:
      // Update an answer in the state
      return adjust(() => action.text, action.index, state)
    case ANSWERS_UPDATE:
      // Update all the answers in the state
      return map(
        (answer) => when(
          is(Object),
          merge(find(propEq('id', answer.id), state)),
        )(answer),
      )(action.answers)
    case ANSWER_REMOVE:
      // Remove an answer in the state
      return when(
        compose(not, equals(action.index), subtract(__, 1), length),
        remove(action.index, 1),
      )(state)
    case ANSWERS_REMOVE_AFTER:
      // Remove the answers after the index in the state
      return slice(0, action.index + 1, state)
    case ANSWERS_CLEAR:
      return []
    default:
      return state
  }
}

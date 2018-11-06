import {
  adjust, compose, not, equals, length, remove, is, merge, find,
  slice, when, subtract, __, map, propEq
} from 'ramda'
import {
  ANSWER_ADD, ANSWER_UPDATE, ANSWERS_UPDATE, ANSWER_REMOVE, ANSWERS_REMOVE_AFTER, ANSWERS_CLEAR
} from 'store/answers/actions'

// TODO : Update answers to reference by identifier and index

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // Add a new answer to the state
  [ANSWER_ADD]           : (previousState) => [...previousState, ''],
  // Update an answer in the state
  [ANSWER_UPDATE]        : (previousState, action) => adjust(() => action.text, action.index, previousState),
  // Update all the answers in the state
  [ANSWERS_UPDATE]       : (previousState, action) =>
    map(
      (answer) => when(
        is(Object),
        merge(find(propEq('id', answer.id), previousState))
      )(answer)
    )(action.answers),
  // Remove an answer in the state
  [ANSWER_REMOVE]        : (previousState, action) =>
    when(
      compose(not, equals(action.index), subtract(__, 1), length),
      remove(action.index, 1)
    )(previousState),
  // Remove the answers after the index in the state
  [ANSWERS_REMOVE_AFTER] : (previousState, action) => slice(0, action.index + 1, previousState),
  // Clear all the answers from the state
  [ANSWERS_CLEAR]        : () => []
}

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
export default function answersReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state

  // switch (action.type) {
  //   case POLL_UPDATE:
  //    return 
  //   default:
  //     return state
  // }
}

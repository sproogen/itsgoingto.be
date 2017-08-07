import { createSelector } from 'reselect'
import { prop, adjust, nth, compose, not, equals, length, remove, omit, is, merge, find,
         isEmpty, slice, findLastIndex, when, subtract, __, gt, trim, map, isNil, propEq } from 'ramda'

// TODO : Update answers to reference by identifier and index

// ------------------------------------
// Constants
// ------------------------------------
export const ANSWER_ADD           = 'ANSWER_ADD'
export const ANSWER_UPDATE        = 'ANSWER_UPDATE'
export const ANSWERS_UPDATE       = 'ANSWERS_UPDATE'
export const ANSWER_REMOVE        = 'ANSWER_REMOVE'
export const ANSWERS_REMOVE_AFTER = 'ANSWERS_REMOVE_AFTER'
export const ANSWERS_CLEAR        = 'ANSWERS_CLEAR'

// ------------------------------------
// Selectors
// ------------------------------------
/**
 * Select answers from the state
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {array}             Answers
 */
export const answersSelector = (state, identifier = '') => prop('answers')(state)

/**
 * Returns the max answer index using the answersSelector
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {integer}           Last index
 */
export const maxAnswerSelector = createSelector(
  answersSelector,
  answers => findLastIndex(compose(not, isEmpty, trim))(answers)
)

/**
 * Get the answer at a given index
 *
 * @param  {object}  state  App state
 * @param  {integer} index  Index of answer
 *
 * @return {object}         Answer object
 */
export const answerSelector = (state, index) => compose(nth(index), answersSelector)(state)

/**
 * Get if the poll has an answer at index
 *
 * @param  {object}  state  App state
 * @param  {integer} index  Index of answer
 *
 * @return {bool}
 */
export const hasAnswerSelector = (state, index) => compose(not, equals(0), length, trim, answerSelector)(state, index)

/**
 * Can the poll be submitted, return true if the poll has more than 2 answers
 *
 * @param  {object} state  App state
 *
 * @return {bool}
 */
export const canSubmitPollSelector = (state) => compose(gt(__, 2), length, answersSelector)(state)

// ------------------------------------
// Actions
// ------------------------------------
/**
 * Add an answer to the state
 *
 * @return {object} dispatchable object
 */
export const addAnswer = () => ({
  type : ANSWER_ADD
})

/**
 * Update the answer in the state the dispatch to add or remove answers
 *
 * @param  {integer} index Answer index
 * @param  {String}  value Answer text
 *
 * @return {Function}      redux-thunk callable function
 */
export const updateAnswer = (index, value = '') => (dispatch, getState) => {
  let hadAnswer = hasAnswerSelector(getState(), index)
  dispatch({
    type  : ANSWER_UPDATE,
    index : index,
    text  : value
  })
  let hasAnswer = hasAnswerSelector(getState(), index)
  let countAnswers = length(answersSelector(getState()))

  if (index === (countAnswers - 1) && hasAnswer && !hadAnswer) {
    dispatch(addAnswer())
  } else if (hadAnswer && !hasAnswer) {
    dispatch(removeAfterAnswer(maxAnswerSelector(getState()) + 1))
  }

  return Promise.resolve()
}

/**
 * Update all the answers in the state
 *
 * @param  {array}  answers Array of answers
 *
 * @return {object}         dispatchable object
 */
export const updateAnswers = (answers = []) => ({
  type    : ANSWERS_UPDATE,
  answers : when(
    compose(not, isNil),
    map(
      when(
        is(Object),
        omit(['poll'])
      ),
    )
  )(answers)
})

/**
 * Remove an answer at the index
 *
 * @param  {integer} index Index of the answer
 *
 * @return {object}         dispatchable object
 */
export const removeAnswer = (index) => ({
  type  : ANSWER_REMOVE,
  index
})

/**
 * Remove answers after the index
 *
 * @param  {integer} index Index after which to remove answers
 *
 * @return {object}         dispatchable object
 */
export const removeAfterAnswer = (index) => ({
  type  : ANSWERS_REMOVE_AFTER,
  index
})

/**
 * Clear all the answers from the state
 *
 * @return {object}         dispatchable object
 */
export const clearAnswers = () => ({
  type : ANSWERS_CLEAR
})

export const actions = {
  addAnswer,
  updateAnswer,
  updateAnswers,
  removeAnswer,
  removeAfterAnswer,
  clearAnswers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // Add a new answer to the state
  [ANSWER_ADD]           : (previousState, action) => [...previousState, ''],
  // Update an answer in the state
  [ANSWER_UPDATE]        : (previousState, action) => adjust(() => action.text, action.index, previousState),
  // Update all the answers in the state
  [ANSWERS_UPDATE]       : (previousState, action) => map(
      answer => when(
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
  [ANSWERS_CLEAR]        : (previousState, action) => []
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
}

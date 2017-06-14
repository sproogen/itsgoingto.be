import { createSelector } from 'reselect'
import { prop, adjust, nth, compose, not, equals, length, remove,
         isEmpty, slice, findLastIndex, when, subtract, __, gt, trim } from 'ramda'

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
export const answersSelector = (state, identifier = '') => prop('answers')(state)

export const maxAnswerSelector = createSelector(
  answersSelector,
  answers => findLastIndex(compose(not, isEmpty, trim))(answers)
)

export const answerSelector = (state, index) => compose(nth(index), answersSelector)(state)

export const hasAnswerSelector = (state, index) => compose(not, equals(0), length, trim, answerSelector)(state, index)

export const canSubmitPollSelector = (state) => compose(gt(__, 2), length, answersSelector)(state)

// ------------------------------------
// Actions
// ------------------------------------
export const addAnswer = () => ({
  type : ANSWER_ADD
})

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
}

export const updateAnswers = (answers) => ({
  type  : ANSWERS_UPDATE,
  answers
})

export const removeAnswer = (index) => ({
  type  : ANSWER_REMOVE,
  index : index
})

export const removeAfterAnswer = (index) => ({
  type  : ANSWERS_REMOVE_AFTER,
  index : index
})

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
  [ANSWER_ADD]           : (previousState, action) => [...previousState, ''],
  [ANSWER_UPDATE]        : (previousState, action) => adjust(() => action.text, action.index, previousState),
  [ANSWERS_UPDATE]       : (previousState, action) => action.answers,
  [ANSWER_REMOVE]        : (previousState, action) =>
    when(
      compose(not, equals(action.index), subtract(__, 1), length),
      remove(action.index, 1)
    )(previousState),
  [ANSWERS_REMOVE_AFTER] : (previousState, action) => slice(0, action.index + 1, previousState),
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

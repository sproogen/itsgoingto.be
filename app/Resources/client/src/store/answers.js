import { adjust, nth, compose, not, equals, length, remove, isEmpty, slice } from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
export const ANSWERS_ADD          = 'ANSWERS_ADD'
export const ANSWERS_UPDATE       = 'ANSWERS_UPDATE'
export const ANSWERS_REMOVE       = 'ANSWERS_REMOVE'
export const ANSWERS_REMOVE_AFTER = 'ANSWERS_REMOVE_AFTER'
export const ANSWERS_CLEAR        = 'ANSWERS_CLEAR'

// ------------------------------------
// Selectors
// ------------------------------------
export const answersSelector = (state) => state.answers

export const answerSelector = (state, index) => nth(index, answersSelector(state))

export const maxAnswerSelector = (state) => {
  let maxAnswer = -1
  answersSelector(state).forEach((answer, index) => {
    if (compose(not, isEmpty)(answer)) {
      maxAnswer = index
    }
  })
  return maxAnswer
}

export const hasAnswerSelector = (state, index) => {
  let answer = answerSelector(state, index)
  return compose(not, equals(0), length)(answer)
}

// ------------------------------------
// Actions
// ------------------------------------
export const addAnswer = () => ({
  type : ANSWERS_ADD
})

export const updateAnswer = (index, value = '') => (dispatch, getState) => {
  let hadAnswer = hasAnswerSelector(getState(), index)
  dispatch({
    type  : ANSWERS_UPDATE,
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

export const removeAnswer = (index) => ({
  type  : ANSWERS_REMOVE,
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
  removeAnswer,
  removeAfterAnswer,
  clearAnswers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ANSWERS_ADD]          : (previousState, action) => [...previousState, ''],
  [ANSWERS_UPDATE]       : (previousState, action) => adjust(() => action.text, action.index, previousState),
  [ANSWERS_REMOVE]       : (previousState, action) => remove(action.index, 1, previousState),
  [ANSWERS_REMOVE_AFTER] : (previousState, action) => slice(0, action.index + 1, previousState),
  [ANSWERS_CLEAR]        : (previousState, action) => []
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = []
export default function answersReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

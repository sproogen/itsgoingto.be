import { createSelector } from 'reselect'
import { compose, not, equals, length } from 'ramda'
import { addAnswer, removeAnswers } from './answers'

// ------------------------------------
// Constants
// ------------------------------------
export const QUESTION_UPDATE = 'QUESTION_UPDATE'

// ------------------------------------
// Selectors
// ------------------------------------
export const questionSelector = (state) => state.question

export const hasQuestionSelector = createSelector(
  questionSelector,
  question => compose(not, equals(0), length)(question)
)

// ------------------------------------
// Actions
// ------------------------------------
export const updateQuestion = (value = '') => (dispatch, getState) => {
  let hadQuestion = hasQuestionSelector(getState())
  dispatch ({
    type    : QUESTION_UPDATE,
    text : value
  })
  let hasQuestion = hasQuestionSelector(getState())

  if (hasQuestion && !hadQuestion) {
    dispatch (addAnswer())
  } else if (hadQuestion && !hasQuestion) {
    dispatch (removeAnswers())
  }
}

export const actions = {
  updateQuestion
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [QUESTION_UPDATE] : (previousState, action) => action.text
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = ''
export default function questionReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

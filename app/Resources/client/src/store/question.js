import { createSelector } from 'reselect'
import { compose, not, equals, length } from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
export const QUESTION_CHANGE = 'QUESTION_CHANGE'

// ------------------------------------
// Selectors
// ------------------------------------
export const questionSelector = (state) => state.question.question

export const hasQuestionSelector = createSelector(
  questionSelector,
  question => compose(not, equals(0), length)(question)
)

// ------------------------------------
// Actions
// ------------------------------------
export const updateQuestion = (value = '') => ({
  type    : QUESTION_CHANGE,
  payload : value
})

export const actions = {
  updateQuestion
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [QUESTION_CHANGE] : (previousState, action) => ({ question: action.payload })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { question: '' }
export default function askReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

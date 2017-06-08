import { createSelector } from 'reselect'
import { path, compose, not, equals, length, pick, omit } from 'ramda'
import { addAnswer, clearAnswers, updateAnswers } from './answers'

// ------------------------------------
// Constants
// ------------------------------------
export const POLL_UPDATE     = 'POLL_UPDATE'
export const QUESTION_UPDATE = 'QUESTION_UPDATE'

// ------------------------------------
// Selectors
// ------------------------------------
export const pollSelector = (state) => path(['poll'])(state)

export const questionSelector = (state) => path(['poll', 'question'])(state)

export const hasQuestionSelector = createSelector(
  questionSelector,
  question => compose(not, equals(0), length)(question)
)

// ------------------------------------
// Actions
// ------------------------------------
export const updatePoll = (poll) => (dispatch, getState) => {
  dispatch({
    type : POLL_UPDATE,
    poll : omit(['answers', 'responsesCount'])(poll)
  })

  let answers = path(['answers'])(poll)
  dispatch(updateAnswers(answers))
}

export const updateQuestion = (value = '') => (dispatch, getState) => {
  let hadQuestion = hasQuestionSelector(getState())
  dispatch({
    type     : QUESTION_UPDATE,
    question : value
  })
  let hasQuestion = hasQuestionSelector(getState())

  if (hasQuestion && !hadQuestion) {
    dispatch(addAnswer())
  } else if (hadQuestion && !hasQuestion) {
    dispatch(clearAnswers())
  }
}

export const actions = {
  updatePoll,
  updateQuestion
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [POLL_UPDATE]     : (previousState, action) => action.poll,
  [QUESTION_UPDATE] : (previousState, action) => ({ question : action.question })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { question: '' }

export default function pollReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

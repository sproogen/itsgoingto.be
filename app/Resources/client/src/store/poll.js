import { createSelector } from 'reselect'
import { prop, compose, not, equals, length, pick, omit, when } from 'ramda'
import { addAnswer, clearAnswers, updateAnswers } from './answers'

// ------------------------------------
// Constants
// ------------------------------------
export const POLL_UPDATE     = 'POLL_UPDATE'
export const QUESTION_UPDATE = 'QUESTION_UPDATE'

// ------------------------------------
// Selectors
// ------------------------------------
export const pollSelector = (state, identifier = '') =>
  when(
    compose(not, equals(identifier), prop('identifier')),
    () => initialState
  )(prop('poll')(state))


export const questionSelector = (state, identifier = '') =>
  prop('question')(pollSelector(state, identifier))

export const hasQuestionSelector = (state, identifier = '') =>
  compose(not, equals(0), length)(questionSelector(state, identifier))

// ------------------------------------
// Actions
// ------------------------------------
export const updatePoll = (poll) => (dispatch, getState) => {
  dispatch({
    type : POLL_UPDATE,
    poll : omit(['answers', 'responsesCount'])(poll)
  })

  dispatch(updateAnswers(prop('answers')(poll)))
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
  [QUESTION_UPDATE] : (previousState, action) => ({ ...previousState, question : action.question })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  question : '',
  identifier: ''
}

export default function pollReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

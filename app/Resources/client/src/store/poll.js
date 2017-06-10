import { createSelector } from 'reselect'
import { prop, compose, not, equals, length, omit, when, find, propEq, adjust, set, lensProp, findIndex, update, ifElse } from 'ramda'
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
    equals(undefined),
    () => initialQuestion
  )
  (find(propEq('identifier', identifier))(prop('poll')(state)))

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
    poll : omit(['answers'])(poll)
  })

  dispatch(updateAnswers(prop('answers')(poll)))
}

export const updateQuestion = (text = '', identifier = '') => (dispatch, getState) => {
  let hadQuestion = hasQuestionSelector(getState(), identifier)
  dispatch({
    type       : QUESTION_UPDATE,
    question   : text,
    identifier : identifier
  })
  let hasQuestion = hasQuestionSelector(getState(), identifier)

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
  [POLL_UPDATE]     : (previousState, action) => {
    console.log(findIndex(propEq('identifier', action.identifier))(previousState))
    return ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', action.identifier))
      ),
      () => [...previousState, action.poll],
      update(
        findIndex(propEq('identifier', action.identifier))(previousState),
        action.poll
      )
    )(previousState)
    },
  [QUESTION_UPDATE] : (previousState, action) =>
    ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', action.identifier))
      ),
      () => [...previousState, compose(
        set(lensProp('question'), action.question)
      )(initialQuestion)],
      adjust(
        set(lensProp('question'), action.question),
        findIndex(propEq('identifier', action.identifier))(previousState)
      )
    )(previousState)
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = []
const initialQuestion = {
  question : '',
  identifier: ''
}

export default function pollReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

import { prop, compose, not, equals, length, omit, when, find, propEq, contains,
         adjust, set, lensProp, findIndex, ifElse, path, isNil, isEmpty, merge, __ } from 'ramda'
import { addAnswer, clearAnswers, updateAnswers } from './answers'

// ------------------------------------
// Constants
// ------------------------------------
export const POLL_UPDATE     = 'POLL_UPDATE'
export const QUESTION_UPDATE = 'QUESTION_UPDATE'
export const initialPoll     = {
  question       : '',
  identifier     : '',
  multipleChoice : false,
  answers        : []
}

// ------------------------------------
// Selectors
// ------------------------------------
/**
 * Get the poll with the given identifier
 *
 * @param  {State}  state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {Poll}            The question text for the poll
 */
export const pollSelector = (state, identifier = '') =>
  when(
    equals(undefined),
    () => omit(['answers'])(initialPoll)
  )(find(propEq('identifier', identifier))(prop('poll')(state)))

/**
 * Get the question text from a poll with the given identifier
 *
 * @param  {State}  state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {string}            The question text for the poll
 */
export const questionSelector = (state, identifier = '') =>
  compose(prop('question'), pollSelector)(state, identifier)

/**
 * Returns true if the poll for the identifier has any question text
 *
 * @param  {State}  state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {bool}
 */
export const hasQuestionSelector = (state, identifier = '') =>
  compose(not, equals(0), length, questionSelector)(state, identifier)

/**
 * Returns the total number of responses from the poll with the given identifier
 *
 * @param  {State}  state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {number}
 */
export const totalResponsesSelector = (state, identifier = '') =>
  compose(
    when(isNil, () => 0),
    prop('responsesCount'),
    pollSelector
  )(state, identifier)

/**
 * Returns true if the user has responded to the poll
 *
 * @param  {State}  state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {bool}
 */
export const userRespondedSelector = (state, identifier = '') =>
  compose(not, isEmpty, prop('userResponses'), pollSelector)(state, identifier)

/**
 * Returns true if the user has responded to given answer
 *
 * @param  {State}   state      App state
 * @param  {string}  identifier Poll identifier
 * @param  {integer} answerId   Answer id
 *
 * @return {bool}
 */
export const userRespondedAnswerSelector = (state, identifier = '', answerId) =>
  compose(contains(answerId), prop('userResponses'), pollSelector)(state, identifier)

// ------------------------------------
// Actions
// ------------------------------------
/**
 * Update the poll in the state then dispatch to update the answers
 *
 * @param  {Poll} poll The poll to add/update the state with
 *
 * @return {Function} redux-thunk callable function
 */
export const updatePoll = (poll) => (dispatch, getState) =>
  ifElse(
    compose(isNil, (prop('answers'))),
    (poll) => Promise.resolve(
            dispatch({
              type : POLL_UPDATE,
              poll : omit(['answers'])(poll)
            })
          ).then(() => poll),
    (poll) => Promise.all([
      dispatch({
        type : POLL_UPDATE,
        poll : omit(['answers'])(poll)
      }),
      dispatch(updateAnswers(prop('answers')(poll)))
    ]).then(() => poll)
  )(poll)

/**
 * Update the question text in the state for a given poll
 * Dispatch to insert or clear the answers appropriately
 *
 * @param  {string} text       The question text
 * @param  {string} identifier The poll identifier to update
 *
 * @return {Function} redux-thunk callable function
 */
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

  return Promise.resolve()
}

/**
 * Update the responses for the poll
 *
 * @param  {Object} responses The responses object
 * @param  {string} identifier The poll identifier to update
 *
 * @return {Function} redux-thunk callable function
 */
export const updateResponses = (responses, identifier) => (dispatch, getState) => Promise.all([
  dispatch({
    type : POLL_UPDATE,
    poll : compose(omit(['answers']), merge(__, { identifier }))(responses)
  }),
  dispatch(updateAnswers(prop('answers')(responses)))
]).then(() => responses)

export const actions = {
  updatePoll,
  updateQuestion,
  updateResponses
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // Insert the poll if it doesn't exist in the state else update the exisitng poll in the state
  [POLL_UPDATE]     : (previousState, action) =>
    ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))
      ),
      () => [...previousState, action.poll],
      adjust(
        merge(__, action.poll),
        findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))(previousState)
      )
    )(previousState),
  // Update the question for a poll in the state if it exists else insert a blank poll with the question
  [QUESTION_UPDATE] : (previousState, action) =>
    ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', action.identifier))
      ),
      () => [...previousState, compose(
        omit(['answers']),
        set(lensProp('question'), action.question)
      )(initialPoll)],
      adjust(
        set(lensProp('question'), action.question),
        findIndex(propEq('identifier', action.identifier))(previousState)
      )
    )(previousState)
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
export default function pollReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

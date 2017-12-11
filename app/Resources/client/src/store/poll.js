import { prop, compose, not, equals, length, omit, when, find, propEq, both, map,
         adjust, set, lensProp, findIndex, ifElse, path, isNil, isEmpty, merge, __ } from 'ramda'
import { addAnswer, clearAnswers, updateAnswers } from './answers'

// ------------------------------------
// Constants
// ------------------------------------
export const POLL_UPDATE     = 'POLL_UPDATE'
export const POLLS_SET       = 'POLLS_SET'
export const POLL_COUNT_SET  = 'POLL_COUNT_SET'
export const QUESTION_UPDATE = 'QUESTION_UPDATE'
export const POLLS_PER_PAGE  = 10
export const initialPoll     = {
  question       : '',
  identifier     : '',
  multipleChoice : false,
  passphrase     : '',
  answers        : [],
  userResponses  : []
}

// ------------------------------------
// Selectors
// ------------------------------------
/**
 * Get the poll with the given identifier
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {Poll}              The question text for the poll
 */
export const pollSelector = (state, identifier = '') =>
  when(
    equals(undefined),
    () => omit(['answers'])(initialPoll)
  )(find(propEq('identifier', identifier))(pollsSelector(state)))

/**
 * TODO : Test this
 *
 * Get the polls from the state
 *
 * @param  {object} state App state
 *
 * @return {Poll[]}       The polls in the state
 */
export const pollsSelector = (state) => path(['poll', 'polls'])(state)

/**
 * TODO : Test this
 *
 * Get the poll count from the state
 *
 * @param  {object} state App state
 *
 * @return {integer}      The poll count from the state
 */
export const pollCountSelector = (state) => path(['poll', 'count'])(state)

/**
 * Get the question text from a poll with the given identifier
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {string}            The question text for the poll
 */
export const questionSelector = (state, identifier = '') =>
  compose(prop('question'), pollSelector)(state, identifier)

/**
 * Returns true if the poll for the identifier has any question text
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {bool}
 */
export const hasQuestionSelector = (state, identifier = '') =>
  compose(
    both(
      compose(not, equals(0), length),
      compose(not, isNil)
    ),
    questionSelector
  )(state, identifier)

/**
 * Returns the total number of responses from the poll with the given identifier
 *
 * @param  {object} state      App state
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
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {bool}
 */
export const userRespondedSelector = (state, identifier = '') =>
  compose(not, isEmpty, prop('userResponses'), pollSelector)(state, identifier)

// ------------------------------------
// Actions
// ------------------------------------
/**
 * Update the poll in the state then dispatch to update the answers
 *
 * @param  {Poll}     poll The poll to add/update the state with
 *
 * @return {Function}      redux-thunk callable function
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
      dispatch(updateAnswers(prop('answers', poll)))
    ]).then(() => poll)
  )(poll)

/**
 * TODO : Test this
 *
 * Set the polls in the state
 *
 * @param  {Poll[]}   polls The array of polls to put in the state
 *
 * @return {Function}       dispatchable object
 */
export const setPolls = (polls = []) => ({
  type  : POLLS_SET,
  polls : map(omit(['answers']))(polls),
})

/**
 * TODO : Test this
 *
 * Set the poll count in the state
 *
 * @param  {integer}  count The total count of polls to put in the state
 *
 * @return {Function}       dispatchable object
 */
export const setPollCount = (count) => ({
  type  : POLL_COUNT_SET,
  count,
})

/**
 * Update the question text in the state for a given poll
 * Dispatch to insert or clear the answers appropriately
 *
 * @param  {string}   text       The question text
 * @param  {string}   identifier The poll identifier to update
 *
 * @return {Function}             redux-thunk callable function
 */
export const updateQuestion = (text = '', identifier = '') => (dispatch, getState) => {
  const hadQuestion = hasQuestionSelector(getState(), identifier)

  dispatch({
    type       : QUESTION_UPDATE,
    question   : text,
    identifier
  })
  const hasQuestion = hasQuestionSelector(getState(), identifier)

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
 * @param  {object}   responses  The responses object
 * @param  {string}   identifier The poll identifier to update
 *
 * @return {Function}            redux-thunk callable function
 */
export const updateResponses = (responses, identifier) => (dispatch, getState) => Promise.all([
  dispatch({
    type : POLL_UPDATE,
    poll : compose(omit(['answers']), merge(__, { identifier }))(responses)
  }),
  dispatch(updateAnswers(prop('answers', responses)))
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
  [POLL_UPDATE]     : (previousState, action) => merge(previousState)({ polls :
    ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))
      ),
      () => [...prop('polls')(previousState), action.poll],
      adjust(
        merge(__, action.poll),
        findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))(prop('polls')(previousState))
      )
    )(prop('polls')(previousState))
  }),
  // Set the polls in the state
  [POLLS_SET]       : (previousState, action) => merge(previousState)({ polls : action.polls }),
  [POLL_COUNT_SET]  : (previousState, action) => merge(previousState)({ count : action.count }),
  // Update the question for a poll in the state if it exists else insert a blank poll with the question
  [QUESTION_UPDATE] : (previousState, action) => merge(previousState)({ polls :
    ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', action.identifier))
      ),
      () => [...prop('polls')(previousState), compose(
        omit(['answers']),
        set(lensProp('question'), action.question)
      )(initialPoll)],
      adjust(
        set(lensProp('question'), action.question),
        findIndex(propEq('identifier', action.identifier))(prop('polls')(previousState))
      )
    )(prop('polls')(previousState))
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = {
  polls: [],
  count: 0
}

/**
 * The reducer for this store component
 *
 * @param  {object} state  The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {object}        The modified state
 */
export default function pollReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

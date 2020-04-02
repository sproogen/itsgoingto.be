import {
  prop, compose, omit, map, ifElse, isNil, merge, __
} from 'ramda'
import { addAnswer, clearAnswers, updateAnswers } from 'store/answers/actions'
import { hasQuestionSelector } from './selectors'
import {
  POLL_UPDATE,
  POLLS_SET,
  POLL_PAGE_SET,
  POLL_COUNT_SET,
  QUESTION_UPDATE
} from './constants'

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
// TODO : Fix reusing poll variable name
export const updatePoll = (poll) => (dispatch) => ifElse(
  compose(isNil, (prop('answers'))),
  (poll) => Promise.resolve( // eslint-disable-line
    dispatch({
      type: POLL_UPDATE,
      poll: omit(['answers'])(poll)
    })
  ).then(() => poll),
  (poll) => Promise.all([ // eslint-disable-line
    dispatch({
      type: POLL_UPDATE,
      poll: omit(['answers'])(poll)
    }),
    dispatch(updateAnswers(prop('answers', poll)))
  ]).then(() => poll)
)(poll)

/**
 * Set the polls in the state
 *
 * @param  {Poll[]}   polls The array of polls to put in the state
 *
 * @return {Function}       dispatchable object
 */
export const setPolls = (polls = []) => ({
  type: POLLS_SET,
  polls: map(omit(['answers']))(polls),
})

/**
 * Set the poll page in the state
 *
 * @param  {integer}  count The total count of polls to put in the state
 *
 * @return {Function}       dispatchable object
 */
export const setPollPage = (page) => ({
  type: POLL_PAGE_SET,
  page,
})

/**
 * Set the poll count in the state
 *
 * @param  {integer}  count The total count of polls to put in the state
 *
 * @return {Function}       dispatchable object
 */
export const setPollCount = (count) => ({
  type: POLL_COUNT_SET,
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
    type: QUESTION_UPDATE,
    question: text,
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
export const updateResponses = (responses, identifier) => (dispatch) => Promise.all([
  dispatch({
    type: POLL_UPDATE,
    poll: compose(omit(['answers', 'userResponses']), merge(__, { identifier }))(responses)
  }),
  dispatch(updateAnswers(prop('answers', responses)))
]).then(() => responses)

/**
 * Update the users responses for the poll
 *
 * @param  {object}   responses  The responses object
 * @param  {string}   identifier The poll identifier to update
 *
 * @return {Function}            redux-thunk callable function
 */
export const updateUserResponses = (responses, identifier) => ({
  type: POLL_UPDATE,
  poll: compose(omit(['answers', 'responsesCount']), merge(__, { identifier }))(responses)
})

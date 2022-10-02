import {
  prop, compose, not, equals, length, omit, when, find, propEq, both, filter,
  path, isNil, isEmpty,
} from 'ramda'
import { initialPoll } from './constants'

/**
 * Get the polls from the state
 *
 * @param  {object} state     App state
 * @param  {bool}   populated Whether the selector should only return real polls
 *
 * @return {Poll[]}       The polls in the state
 */
export const pollsSelector = (state, populated = false) => compose(
  filter(
    when(
      () => populated,
      compose(not, isEmpty, prop('identifier')),
    ),
  ),
  path(['poll', 'polls']),
)(state)

/**
 * Get the poll with the given identifier
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {Poll}              The question text for the poll
 */
export const pollSelector = (state, identifier = '') => when(
  equals(undefined),
  () => omit(['answers'])(initialPoll),
)(find(propEq('identifier', identifier))(pollsSelector(state)))

/**
 * Get the poll page from the state
 *
 * @param  {object} state App state
 *
 * @return {integer}      The poll page from the state
 */
export const pollPageSelector = (state) => path(['poll', 'page'])(state)

/**
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
export const questionSelector = (state, identifier = '') => compose(prop('question'), pollSelector)(state, identifier)

/**
 * Returns true if the poll for the identifier has any question text
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {bool}
 */
export const hasQuestionSelector = (state, identifier = '') => compose(
  both(
    compose(not, equals(0), length),
    compose(not, isNil),
  ),
  questionSelector,
)(state, identifier)

/**
 * Returns the total number of responses from the poll with the given identifier
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {number}
 */
export const totalResponsesSelector = (state, identifier = '') => compose(
  when(isNil, () => 0),
  prop('responsesCount'),
  pollSelector,
)(state, identifier)

/**
 * Returns true if the user has responded to the poll
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {bool}
 */
export const userRespondedSelector = (state, identifier = '') => compose(
  not,
  isEmpty,
  prop('userResponses'),
  pollSelector,
)(state, identifier)

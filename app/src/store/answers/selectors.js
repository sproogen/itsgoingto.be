import { createSelector } from 'reselect'
import {
  prop, nth, compose, not, equals, length, isEmpty, findLastIndex, __, gt, trim,
} from 'ramda'

/**
 * Select answers from the state
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {array}             Answers
 */
export const answersSelector = (state) => prop('answers')(state)

/**
 * Returns the max answer index using the answersSelector
 *
 * @param  {object} state      App state
 * @param  {string} identifier Poll identifier
 *
 * @return {integer}           Last index
 */
export const maxAnswerSelector = createSelector(
  answersSelector,
  (answers) => findLastIndex(compose(not, isEmpty, trim))(answers),
)

/**
 * Get the answer at a given index
 *
 * @param  {object}  state  App state
 * @param  {integer} index  Index of answer
 *
 * @return {object}         Answer object
 */
export const answerSelector = (state, index) => compose(nth(index), answersSelector)(state)

/**
 * Get if the poll has an answer at index
 *
 * @param  {object}  state  App state
 * @param  {integer} index  Index of answer
 *
 * @return {bool}
 */
export const hasAnswerSelector = (state, index) => compose(not, equals(0), length, trim, answerSelector)(state, index)

/**
 * Can the poll be submitted, return true if the poll has more than 2 answers
 *
 * @param  {object} state  App state
 *
 * @return {bool}
 */
export const canSubmitPollSelector = (state) => compose(gt(__, 2), length, answersSelector)(state)

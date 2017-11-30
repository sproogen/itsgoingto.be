import { prop, compose, not, isEmpty, contains, without, append, ifElse, both, equals, length, when, path, omit,
         merge } from 'ramda'
import moment from 'moment'
import { pollSelector, updatePoll, updateResponses } from './poll'
import { answersSelector } from './answers'
import { updateUser } from './user'

// ------------------------------------
// Constants
// ------------------------------------
export const ROUTE_POLL = '/api/polls'
export const ROUTE_RESPONSES = '/responses'
export const ROUTE_LOGIN = '/api/login'
export const API_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

// ------------------------------------
// Helpers
// ------------------------------------
export function APIError (details) {
  this.name = 'APIError'
  this.details = details
}
APIError.prototype = Object.create(Error.prototype)
APIError.prototype.constructor = APIError

// Extract the json response. Rejects if the response is not 200
export const extractResponse = (response) => {
  if (response.status === 200) {
    return response.json()
  } else {
    return response.json()
    .then((error) => {
      return Promise.reject(
        new APIError({
          status     : response.status,
          statusText : response.statusText,
          error
        })
      )
    })
  }
}

// Parse an error and displays a suitible message to the user.
export const onError = (error) => {
  // TODO : Display an error message to the user
  if (!(error instanceof APIError)) {
    error = new APIError({
      status     : error.status,
      statusText : error.statusText,
      error
    })
  }
  console.error('There was an error', error)
  return error
}

export const getEndDateFromPoll = (poll) => {
  if (poll.endType === 'endAt') {
    return poll.endAt.format(API_DATE_FORMAT)
  } else if (poll.endType === 'endIn') {
    return moment()
            .add(poll.endIn, 'hours')
            .seconds(0)
            .milliseconds(0)
            .format(API_DATE_FORMAT)
  } else {
    return null
  }
}

// ------------------------------------
// Actions
// ------------------------------------
/**
 * Post a poll through the api, fetches the poll and answer from the selectors
 *
 * @return {Function} redux-thunk callable function
 */
export const postPoll = () => (dispatch, getState) =>
  compose(
    (poll) => fetch(ROUTE_POLL, {
      credentials : 'same-origin',
      method      : 'POST',
      body        : JSON.stringify({
        question        : poll.question,
        answers         : answersSelector(getState()),
        multipleChoice  : poll.multipleChoice,
        passphrase      : poll.passphrase,
        endDate         : getEndDateFromPoll(poll)
      })
    })
    .then(extractResponse)
    .then((response) => dispatch(updatePoll(response)))
    .catch(onError),
    pollSelector
  )(getState())

/**
 * Fetches a poll with the identifier from the api
 *
 * @param  {string} identifier The identifier for the poll
 *
 * @return {Function} redux-thunk callable function
 */
export const fetchPoll = (identifier) => (dispatch, getState) =>
  compose(
    (url) => fetch(url, {
      credentials : 'same-origin'
    })
      .then(extractResponse)
      .then((response) => dispatch(updatePoll(response)))
      .catch(onError),
    ifElse(
      compose(not, equals(0), length, prop('passphrase')),
      (poll) => ROUTE_POLL + '/' + identifier + '?passphrase=' + prop('passphrase')(poll),
      () => ROUTE_POLL + '/' + identifier
    ),
    pollSelector
  )(getState(), identifier)

/**
 * Posts the response for a poll with the identifier to the api
 *
 * @param  {integer} answer     The id of the answer to submit
 * @param  {string}  identifier The identifier for the poll
 *
 * @return {Function} redux-thunk callable function
 */
export const postResponse = (answer, identifier) => (dispatch, getState) =>
  compose(
    (requestData) => fetch(ROUTE_POLL + '/' + identifier + ROUTE_RESPONSES,
      {
        credentials : 'same-origin',
        method      : 'POST',
        body        : JSON.stringify(requestData)
      }
    )
      .then(extractResponse)
      .then((response) => dispatch(updateResponses(response, identifier)))
      .catch(onError),
    omit(['poll']),
    when(
      compose(not, equals(0), length, path(['poll', 'passphrase'])),
      (data) => merge(data, { passphrase : path(['poll', 'passphrase'])(data) })
    ),
    (poll) => ({
      poll,
      answers : ifElse(
        both(prop('multipleChoice'), compose(not, isEmpty, prop('userResponses'))),
        compose(
          ifElse(
            contains(answer),
            without([answer]),
            append(answer)
          ),
          prop('userResponses')
        ),
        () => [answer]
      )(poll)
    }),
    pollSelector
  )(getState(), identifier)

/**
 * Fetches the responses for a poll
 *
 * @param  {string} identifier The identifier for the poll
 *
 * @return {Function} redux-thunk callable function
 */
export const fetchResponses = (identifier) => (dispatch, getState) =>
  compose(
    (url) => fetch(url, {
      credentials : 'same-origin'
    })
      .then(extractResponse)
      .then((response) => dispatch(updateResponses(response, identifier)))
      .catch(onError),
    ifElse(
      compose(not, equals(0), length, prop('passphrase')),
      (poll) => ROUTE_POLL + '/' + identifier + ROUTE_RESPONSES + '?passphrase=' + prop('passphrase')(poll),
      () => ROUTE_POLL + '/' + identifier + ROUTE_RESPONSES
    ),
    pollSelector
  )(getState(), identifier)

/**
 * Post a login request through the api.
 *
 * @param  {string} username The username to login with
 * @param  {string} password The password to login with
 *
 * @return {Function} redux-thunk callable function
 */
export const postLogin = (username, password) => (dispatch) =>
  fetch(ROUTE_LOGIN, {
    credentials : 'same-origin',
    method      : 'POST',
    body        : JSON.stringify({
      username,
      password,
    })
  })
  .then(extractResponse)
  .then((response) => dispatch(updateUser(response)))
  .then((response) => prop('user')(response))
  .catch(onError)

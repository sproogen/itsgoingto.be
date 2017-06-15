import { questionSelector, updatePoll } from './poll'
import { answersSelector } from './answers'

// ------------------------------------
// Constants
// ------------------------------------
export const ROUTE_QUESTION = '/api/questions'

// ------------------------------------
// Helpers
// ------------------------------------
export const APIError = (details) => {
  this.name = 'APIError'
  this.details = details
  this.stack = (new Error()).stack
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
  console.error('There was an error', error.details)
  return false
}

// ------------------------------------
// Actions
// ------------------------------------
export const postPoll = () => (dispatch, getState) =>
  fetch(ROUTE_QUESTION, {
    method: 'POST',
    body: JSON.stringify({
      question: questionSelector(getState()),
      answers: answersSelector(getState()),
    })
  })
  .then(extractResponse)
  .then((response) => dispatch(updatePoll(response)))
  .catch(onError)

export const fetchPoll = (identifier) => (dispatch, getState) =>
  fetch(ROUTE_QUESTION + '/' + identifier)
  .then(extractResponse)
  .then((response) => {
    return dispatch(updatePoll(response))
  })
  .catch(onError)

import { questionSelector, updatePoll } from './poll'
import { answersSelector } from './answers'

// ------------------------------------
// Constants
// ------------------------------------
export const ROUTE_QUESTION = '/api/questions'
export const ROUTE_RESPONSES = '/responses'

// ------------------------------------
// Helpers
// ------------------------------------
function APIError(details) {
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
  console.error('There was an error', error)
  return false
}

// ------------------------------------
// Actions
// ------------------------------------
export const postPoll = () => (dispatch, getState) =>
  fetch(ROUTE_QUESTION, {
    credentials : 'same-origin',
    method      : 'POST',
    body        : JSON.stringify({
      question : questionSelector(getState()),
      answers  : answersSelector(getState())
    })
  })
  .then(extractResponse)
  .then((response) => dispatch(updatePoll(response)))
  .catch(onError)

export const fetchPoll = (identifier) => (dispatch, getState) =>
  fetch(ROUTE_QUESTION + '/' + identifier, {
    credentials : 'same-origin'
  })
  .then(extractResponse)
  .then((response) => {
    return dispatch(updatePoll(response))
  })
  .catch(onError)

// TODO : Test this.
export const postResponse = (answer, identifier) => (dispatch, getState) =>
  fetch(ROUTE_QUESTION + '/' + identifier + ROUTE_RESPONSES, {
    credentials : 'same-origin',
    method      : 'POST',
    body        : JSON.stringify({
      answers : [answer]
    })
  })
  .then(extractResponse)
  .then((response) => {
    console.log(response)
    // TODO : Update responses in state.
  })
  .catch(onError)

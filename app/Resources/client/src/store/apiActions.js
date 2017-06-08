// ------------------------------------
// Constants
// ------------------------------------
export const ROUTE_QUESTION = '/api/questions'

// ------------------------------------
// Actions
// ------------------------------------
export const postPoll = () => (dispatch, getState) => {
  // TODO : Change this into post with question data
  return fetch(ROUTE_QUESTION)
  .then((response) => response.json())
  .then((response) => {
    // TODO : Save the question to state
    // TODO : Redirect to the question page
    console.log(response);
    return true
  }).catch((error) => {
    // TODO : Display an error message to the user
    console.error(error)
    return false
  })
}

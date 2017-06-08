// ------------------------------------
// Constants
// ------------------------------------
export const ROUTE_QUESTION = '/api/questions'

// ------------------------------------
// Actions
// ------------------------------------
export const postPoll = () => (dispatch, getState) => {
  // TODO : Change this into post with question data
  return fetch(ROUTE_QUESTION, {
    method: 'POST'
  })
  .then((response) => {
    // TODO : Move this check into its own helper
    if (response.status === 200) {
      return response.json()
    } else {
      return response.json()
      .then((error) => {
        return Promise.reject({
          status     : response.status,
          statusText : response.statusText,
          error
        })
      })
    }
  }).then((response) => {
    // TODO : Save the question to state
    // TODO : Redirect to the question page
    console.log(response);
    return true
  }).catch((error) => {
    // TODO : Display an error message to the user
    console.error('There was an error', error)
    return false
  })
}

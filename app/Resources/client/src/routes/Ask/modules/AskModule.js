// ------------------------------------
// Constants
// ------------------------------------
export const QUESTION_CHANGE = 'QUESTION_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export const updateQuestion = (value = '') => ({
  type    : QUESTION_CHANGE,
  payload : value
})

export const actions = {
  updateQuestion
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [QUESTION_CHANGE] : (previousState, action) => ({ question: action.payload })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { question: '' }
export default function askReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

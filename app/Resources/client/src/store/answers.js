// ------------------------------------
// Constants
// ------------------------------------
export const ANSWERS_ADD    = 'ANSWERS_ADD'
export const ANSWERS_REMOVE = 'ANSWERS_REMOVE'

// ------------------------------------
// Selectors
// ------------------------------------
export const answersSelector = (state) => state.answers

// ------------------------------------
// Actions
// ------------------------------------
export const addAnswer = () => ({
  type    : ANSWERS_ADD
})

export const removeAnswers = () => ({
  type    : ANSWERS_REMOVE
})

export const actions = {
  addAnswer,
  removeAnswers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ANSWERS_ADD]    : (previousState, action) => [...previousState, ''],
  [ANSWERS_REMOVE] : (previousState, action) => []
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = []
export default function answersReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

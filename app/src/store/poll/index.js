import { prop, compose, equals, omit, propEq, adjust, set, lensProp, findIndex, ifElse, path, merge, __ } from 'ramda'
import { POLL_UPDATE, POLLS_SET, POLL_PAGE_SET, POLL_COUNT_SET, QUESTION_UPDATE } from 'store/poll/actions'

// ------------------------------------
// Constants
// ------------------------------------
export const POLLS_PER_PAGE  = 10
export const initialPoll     = {
  question       : '',
  identifier     : '',
  multipleChoice : false,
  passphrase     : '',
  answers        : [],
  userResponses  : []
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // Insert the poll if it doesn't exist in the state else update the exisitng poll in the state
  [POLL_UPDATE]     : (previousState, action) => merge(previousState)({ polls :
    ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))
      ),
      () => [...prop('polls')(previousState), action.poll],
      adjust(
        merge(__, action.poll),
        findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))(prop('polls')(previousState))
      )
    )(prop('polls')(previousState))
  }),
  // Update the state and override the polls with the given polls
  [POLLS_SET]       : (previousState, action) => merge(previousState)({ polls : action.polls }),
  // Update the state with the given poll page
  [POLL_PAGE_SET]   : (previousState, action) => merge(previousState)({ page : action.page }),
  // Update the state with the given poll count
  [POLL_COUNT_SET]  : (previousState, action) => merge(previousState)({ count : action.count }),
  // Update the question for a poll in the state if it exists else insert a blank poll with the question
  [QUESTION_UPDATE] : (previousState, action) => merge(previousState)({ polls :
    ifElse(
      compose(
        equals(-1),
        findIndex(propEq('identifier', action.identifier))
      ),
      () => [...prop('polls')(previousState), compose(
        omit(['answers']),
        set(lensProp('question'), action.question)
      )(initialPoll)],
      adjust(
        set(lensProp('question'), action.question),
        findIndex(propEq('identifier', action.identifier))(prop('polls')(previousState))
      )
    )(prop('polls')(previousState))
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
/**
 * Initial state for this store component
 */
const initialState = {
  polls : [],
  page  : 0,
  count : 0
}

/**
 * The reducer for this store component
 *
 * @param  {object} state  The current state
 * @param  {object} action The action to perform on the state
 *
 * @return {object}        The modified state
 */
export default function pollReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
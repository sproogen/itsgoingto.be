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
  switch (action.type) {
    case POLL_UPDATE:
    // Insert the poll if it doesn't exist in the state else update the exisitng poll in the state
      return merge(state)({ polls :
        ifElse(
          compose(
            equals(-1),
            findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))
          ),
          () => [...prop('polls')(state), action.poll],
          adjust(
            merge(__, action.poll),
            findIndex(propEq('identifier', path(['poll', 'identifier'])(action)))(prop('polls')(state))
          )
        )(prop('polls')(state))
      })
    case POLLS_SET:
    // Update the state and override the polls with the given polls
      return merge(state)({ polls : action.polls })
    case POLL_PAGE_SET:
    // Update the state with the given poll page
      return merge(state)({ page : action.page })
    case POLL_COUNT_SET:
    // Update the state with the given poll count
      return merge(state)({ count : action.count })
    case QUESTION_UPDATE:
      // Update the question for a poll in the state if it exists else insert a blank poll with the question
      return merge(state)({ polls :
        ifElse(
          compose(
            equals(-1),
            findIndex(propEq('identifier', action.identifier))
          ),
          () => [...prop('polls')(state), compose(
            omit(['answers']),
            set(lensProp('question'), action.question)
          )(initialPoll)],
          adjust(
            set(lensProp('question'), action.question),
            findIndex(propEq('identifier', action.identifier))(prop('polls')(state))
          )
        )(prop('polls')(state))
      })
    default:
      return state
  }
}

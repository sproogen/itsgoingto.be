import { connect } from 'react-redux'
import { mergeAll } from 'ramda'
import { withCookies } from 'react-cookie'
import { fetchPoll, postResponse } from 'services/api'
import {
  pollSelector, hasQuestionSelector, totalResponsesSelector, userRespondedSelector,
} from 'store/poll/selectors'
import { updateResponses, updateUserResponses } from 'store/poll/actions'
import { answersSelector } from 'store/answers/selectors'
import { clearAnswers } from 'store/answers/actions'
import { requiresPassphraseSelector } from 'store/loader/selectors'
import { setLoading, setRequiresPassphrase } from 'store/loader/actions'
import { hasUserSelector } from 'store/user/selectors'

import Answer from './answer'

const mapStateToProps = (state, { match: { params: { identifier } } }) => ({
  poll: pollSelector(state, identifier),
  hasPoll: hasQuestionSelector(state, identifier),
  requiresPassphrase: requiresPassphraseSelector(state),
  answers: answersSelector(state),
  totalResponses: totalResponsesSelector(state, identifier),
  userResponded: userRespondedSelector(state, identifier),
  hasUser: hasUserSelector(state),
})

const mapDispatchToProps = (dispatch, { match: { params: { identifier } } }) => ({
  fetchPoll: () => dispatch(fetchPoll(identifier)),
  clearAnswers: () => dispatch(clearAnswers()),
  setLoading: (value) => dispatch(setLoading(value)),
  setRequiresPassphrase: (value) => dispatch(setRequiresPassphrase(value)),
  postResponse: (id) => dispatch(postResponse(id, identifier)),
  updateResponses: (responses) => dispatch(updateResponses(responses, identifier)),
  updateUserResponses: (responses) => dispatch(updateUserResponses(responses, identifier)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.match.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(withCookies(Answer))

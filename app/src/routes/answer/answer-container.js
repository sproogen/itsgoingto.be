import { connect } from 'react-redux'
import { mergeAll } from 'ramda'
import { withCookies } from 'react-cookie'
import { fetchPoll, postResponse } from 'services/api'
import {
  pollSelector, hasQuestionSelector, totalResponsesSelector, userRespondedSelector
} from 'store/poll/selectors'
import { updateResponses, updateUserResponses } from 'store/poll/actions'
import { answersSelector } from 'store/answers/selectors'
import { clearAnswers } from 'store/answers/actions'
import { requiresPassphraseSelector } from 'store/loader/selectors'
import { setLoading, setRequiresPassphrase } from 'store/loader/actions'
import { hasUserSelector } from 'store/user/selectors'

import Answer from './answer'

const mapStateToProps = (state, props) => ({
  poll: pollSelector(state, props.params.identifier),
  hasPoll: hasQuestionSelector(state, props.params.identifier),
  requiresPassphrase: requiresPassphraseSelector(state),
  answers: answersSelector(state),
  totalResponses: totalResponsesSelector(state, props.params.identifier),
  userResponded: userRespondedSelector(state, props.params.identifier),
  hasUser: hasUserSelector(state),
})

const mapDispatchToProps = (dispatch, props) => ({
  fetchPoll: () => dispatch(fetchPoll(props.params.identifier)),
  clearAnswers: () => dispatch(clearAnswers()),
  setLoading: (value) => dispatch(setLoading(value)),
  setRequiresPassphrase: (value) => dispatch(setRequiresPassphrase(value)),
  postResponse: (id) => dispatch(postResponse(id, props.params.identifier)),
  updateResponses: (responses) => dispatch(updateResponses(responses, props.params.identifier)),
  updateUserResponses: (responses) => dispatch(updateUserResponses(responses, props.params.identifier))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(withCookies(Answer))

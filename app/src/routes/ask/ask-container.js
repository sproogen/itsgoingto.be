import { connect } from 'react-redux'
import { questionSelector, hasQuestionSelector, pollSelector } from 'store/poll/selectors'
import { updatePoll } from 'store/poll/actions'
import { initialPoll } from 'store/poll/constants'
import { canSubmitPollSelector, answersSelector } from 'store/answers/selectors'

import Ask from './ask'

const mapStateToProps = (state) => ({
  question: questionSelector(state),
  hasQuestion: hasQuestionSelector(state),
  canSubmitPoll: canSubmitPollSelector(state),
  poll: pollSelector(state),
  answers: answersSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  clearPoll: () => dispatch(updatePoll(initialPoll))
})

export default connect(mapStateToProps, mapDispatchToProps)(Ask)

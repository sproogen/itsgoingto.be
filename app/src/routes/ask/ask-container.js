import { connect } from 'react-redux'
import { initialPoll } from 'store/poll/constants'
import { questionSelector, hasQuestionSelector, pollSelector } from 'store/poll/selectors'
import { updatePoll, updateQuestion, updatePoll } from 'store/poll/actions'
import { canSubmitPollSelector, answersSelector } from 'store/answers/selectors'
import { updateAnswer, removeAnswer } from 'store/answers/actions'
import { postPoll } from 'services/api'

import Ask from './ask'

const mapStateToProps = (state) => ({
  question: questionSelector(state),
  hasQuestion: hasQuestionSelector(state),
  canSubmitPoll: canSubmitPollSelector(state),
  poll: pollSelector(state),
  answers: answersSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  clearPoll: () => dispatch(updatePoll(initialPoll)),
  postPoll: () => dispatch(postPoll()),
  updateQuestion: (question) => dispatch(updateQuestion(question)),
  onAnswerChange: (index, value) => dispatch(updateAnswer(index, value)),
  onRemoveAnswer: (index) => dispatch(removeAnswer(index)),
  updateOptions: (value) => dispatch(updatePoll(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Ask)

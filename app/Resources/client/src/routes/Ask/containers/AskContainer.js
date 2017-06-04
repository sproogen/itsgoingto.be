import { connect } from 'react-redux'
import { updateQuestion, questionSelector, hasQuestionSelector } from '../modules/AskModule'
import Ask from '../components/Ask'

const mapDispatchToProps = (dispatch) => ({
  onQuestionChange : (value) => {
    dispatch(updateQuestion(value))
  }
})

const mapStateToProps = (state) => {
  return{
    question    : questionSelector(state.ask),
    hasQuestion : hasQuestionSelector(state.ask)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ask)

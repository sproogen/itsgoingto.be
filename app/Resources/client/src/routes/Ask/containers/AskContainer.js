import { connect } from 'react-redux'
import { updateQuestion } from '../modules/ask'
import Ask from '../components/Ask'

const mapDispatchToProps = (dispatch) => ({
  onQuestionChange : (value) => {
    dispatch(updateQuestion(value))
  }
})

const mapStateToProps = (state) => {
  return{
    question : state.ask.question
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ask)

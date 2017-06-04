import { connect } from 'react-redux'
import { hasQuestionSelector } from '../modules/AskModule'
import Answers from '../components/Answers'

const mapStateToProps = (state) => {
  return{
    hasQuestion : hasQuestionSelector(state.ask)
  }
}

export default connect(mapStateToProps)(Answers)

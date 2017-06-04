import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { questionSelector, hasQuestionSelector, updateQuestion } from '../../store/question'
import Answers from '../Answers/Answers'
import './Question.scss'

export const Question = ({ question, hasQuestion, onQuestionChange }) => {
  const handleChange = (event) => {
    onQuestionChange(event.target.value)
  }

  return (
    <div className={'container question-container' + (hasQuestion ? ' move-up' : '')}>
      <div className='input input-question'>
        <label className='input-label input-label-question' htmlFor='question'>Ask a question</label>
        <textarea
          className='input-field input-field-question js-auto-size'
          value={question}
          onChange={handleChange}
          rows='1'
          id='question'
          name='question' />
      </div>
      <Answers />
    </div>
  )
}

Question.propTypes = {
  question: PropTypes.string.isRequired,
  hasQuestion: PropTypes.bool.isRequired,
  onQuestionChange: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  onQuestionChange : (value) => {
    dispatch(updateQuestion(value))
  }
})

const mapStateToProps = (state) => {
  return{
    question    : questionSelector(state),
    hasQuestion : hasQuestionSelector(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)

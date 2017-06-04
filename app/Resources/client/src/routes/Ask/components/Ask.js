import React from 'react'
import PropTypes from 'prop-types'
import { compose, not, equals, length } from 'ramda'
import WordRotate from '../../../components/WordRotate/WordRotate'
import Answers from '../containers/AnswersContainer'
import '../styles/Ask.scss'

const Ask = ({ question, hasQuestion, onQuestionChange }) => {
  const handleChange = (event) => {
    onQuestionChange(event.target.value)
  }

  return (
    <div>
      <div className={'container header-container hideable' + (hasQuestion ? ' gone' : '')}>
        <div className='header center-text'>
          <h1><WordRotate words='What,Where,When,Who' /> is it going to be?</h1>
        </div>
      </div>
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
    </div>
  )
}
Ask.propTypes = {
  question: PropTypes.string.isRequired,
  hasQuestion: PropTypes.bool.isRequired,
  onQuestionChange: PropTypes.func.isRequired
}

export default Ask

import React from 'react'
import PropTypes from 'prop-types'
import { compose, not, equals, length } from 'ramda'
import WordRotate from '../../../components/WordRotate/WordRotate'
import '../styles/Ask.scss'

const Ask = ({ question, onQuestionChange }) => {
  const hasQuestion = () => {
    return compose(not, equals(0), length)(question)
  }

  const handleChange = (event) => {
    onQuestionChange(event.target.value)
  }

  return (
    <div>
      <div className={'container header-container hideable' + (hasQuestion() ? ' gone' : '')}>
        <div className='header center-text'>
          <h1><WordRotate words='What,Where,When,Who' /> is it going to be?</h1>
        </div>
      </div>
      <div className={'container question-container' + (hasQuestion() ? ' move-up' : '')}>
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
        <div className={"answers hideable" + (hasQuestion() ? '' : ' gone-off')}>
          <div className="input input-answer">
            <label className='input-label input-label-answer' htmlFor='answer-1'>1</label>
            <input className="input-field input-field-answer" type="text" id="answer-1" name="answer-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
Ask.propTypes = {
  question: PropTypes.string.isRequired,
  onQuestionChange: PropTypes.func.isRequired
}

export default Ask

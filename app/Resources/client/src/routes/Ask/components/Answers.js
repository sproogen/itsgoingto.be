import React from 'react'
import PropTypes from 'prop-types'
import '../styles/Ask.scss'

const Answers = ({ hasQuestion }) => {
  return (
    <div className={"answers hideable" + (hasQuestion ? '' : ' gone')}>
      <div className="input input-answer">
        <label className='input-label input-label-answer' htmlFor='answer-1'>1</label>
        <input className="input-field input-field-answer" type="text" id="answer-1" name="answer-1" />
      </div>
    </div>
  )
}
Answers.propTypes = {
  hasQuestion: PropTypes.bool.isRequired,
}

export default Answers

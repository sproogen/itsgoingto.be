import React from 'react'
import PropTypes from 'prop-types'
import './multiple-choice.scss'

const MultipleChoice = ({ poll, updateOptions }) => {
  const handleMultipleChoiceChange = (event) => updateOptions({
    identifier: '',
    multipleChoice: event.target.checked
  })

  return (
    <div className="input-option input-option-multipleChoice">
      <label
        htmlFor="multiple-choice"
        className="input-label input-label-options input-label-multipleChoice"
      >
        <input
          id="multiple-choice"
          className="input-checkbox input-checkbox-multipleChoice"
          name="multiple"
          type="checkbox"
          checked={poll.multipleChoice}
          onChange={handleMultipleChoiceChange}
        />
        Multiple choice responses
      </label>
    </div>
  )
}

MultipleChoice.propTypes = {
  poll: PropTypes.shape({
    multipleChoice: PropTypes.bool
  }).isRequired,
  updateOptions: PropTypes.func.isRequired
}

export default MultipleChoice

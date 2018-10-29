import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updatePoll } from 'store/poll'
import './multiple-choice.scss'

class MultipleChoice extends PureComponent {
  handleMultipleChoiceChange = (event) =>
    this.props.updateOptions({
      identifier     : '',
      multipleChoice : event.target.checked
    })

  render () {
    const { poll } = this.props

    return (
      <div className='input-option input-option-multipleChoice'>
        <input
          id='multiple-choice'
          className='input-checkbox input-checkbox-multipleChoice'
          name='multiple'
          type='checkbox'
          checked={poll.multipleChoice}
          onChange={this.handleMultipleChoiceChange} />
        <label
          htmlFor='multiple-choice'
          className='input-label input-label-options input-label-multipleChoice'>
          Multiple choice responses
        </label>
      </div>
    )
  }
}

MultipleChoice.propTypes = {
  poll          : PropTypes.object.isRequired,
  updateOptions : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  updateOptions: (value) => dispatch(updatePoll(value))
})

export default connect(null, mapDispatchToProps)(MultipleChoice)

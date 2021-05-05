import React from 'react'
import PropTypes from 'prop-types'
import MultipleChoice from './multiple-choice'
import Passphrase from './passphrase'
import EndPoll from './end-poll'
import './options.scss'

const Options = ({ poll, updateOptions }) => (
  <div
    data-testid="options"
    className="options"
  >
    <MultipleChoice poll={poll} updateOptions={updateOptions} />
    <Passphrase poll={poll} updateOptions={updateOptions} />
    <EndPoll poll={poll} updateOptions={updateOptions} />
  </div>
)

Options.propTypes = {
  poll: PropTypes.shape({
    endType: PropTypes.string,
    endIn: PropTypes.number,
    endAt: PropTypes.object,
    passphrase: PropTypes.string,
    multipleChoice: PropTypes.bool
  }).isRequired,
  updateOptions: PropTypes.func.isRequired
}

export default Options

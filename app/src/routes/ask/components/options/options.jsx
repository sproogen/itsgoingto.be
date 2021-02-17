import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MultipleChoice from './multiple-choice'
import Passphrase from './passphrase'
import EndPoll from './end-poll'
import './options.scss'

const Options = ({ hasQuestion, poll, updateOptions }) => (
  <div>
    <div
      data-testid="options"
      className={classNames(
        'options hideable',
        {
          gone: !hasQuestion
        }
      )}
    >
      <MultipleChoice poll={poll} updateOptions={updateOptions} />
      <Passphrase poll={poll} updateOptions={updateOptions} />
      <EndPoll poll={poll} updateOptions={updateOptions} />
    </div>
  </div>
)

Options.propTypes = {
  hasQuestion: PropTypes.bool.isRequired,
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

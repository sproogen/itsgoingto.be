import React from 'react'
import PropTypes from 'prop-types'
import MultipleChoice from './multiple-choice'
import Passphrase from './passphrase'
import EndPoll from './end-poll'
import './options.scss'

const Options = ({ hasQuestion, poll }) => (
  <div>
    <div className={'options hideable' + (hasQuestion ? '' : ' gone')}>
      <MultipleChoice poll={poll}/>
      <Passphrase poll={poll}/>
      <EndPoll poll={poll}/>
    </div>
  </div>
)

Options.propTypes = {
  hasQuestion : PropTypes.bool.isRequired,
  poll        : PropTypes.object.isRequired,
}

export default Options

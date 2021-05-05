import React from 'react'
import PropTypes from 'prop-types'
import Button from 'components/button'
import './actions.scss'

const Actions = ({
  canSubmitPoll,
  submitPoll,
}) => (
  <div className="actions">
    <Button
      className="pull-right"
      text="Create Poll"
      disabled={!canSubmitPoll}
      callback={submitPoll}
    />
  </div>
)

Actions.propTypes = {
  canSubmitPoll: PropTypes.bool.isRequired,
  submitPoll: PropTypes.func.isRequired,
}

export default Actions

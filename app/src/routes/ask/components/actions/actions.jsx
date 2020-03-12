import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import Button from 'components/button'
import './actions.scss'

const Actions = ({
  hasQuestion, canSubmitPoll, postPoll,
}) => {
  const history = useHistory()

  const submit = () => postPoll()
    .then((response) => {
      if (response !== false) {
        history.push(`/'${response.identifier}`)
        return false
      }
      return true
    })

  return (
    <div>
      <div
        className={classNames(
          'actions hideable',
          { gone: !hasQuestion }
        )}
      >
        <Button
          className="pull-right"
          text="Create Poll"
          disabled={!canSubmitPoll}
          callback={submit}
        />
      </div>
    </div>
  )
}

Actions.propTypes = {
  hasQuestion: PropTypes.bool.isRequired,
  canSubmitPoll: PropTypes.bool.isRequired,
  postPoll: PropTypes.func.isRequired
}

export default Actions

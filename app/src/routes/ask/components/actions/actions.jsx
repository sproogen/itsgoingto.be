import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty, isNil } from 'ramda'
import { useHistory } from 'react-router-dom'
import Button from 'components/button'
import './actions.scss'

const Actions = ({
  hasQuestion, canSubmitPoll, postPoll, setPassphrase, poll
}) => {
  const history = useHistory()

  const submit = () => postPoll()
    .then((response) => {
      if (response !== false) {
        if (!isNil(poll.passphrase) && !isEmpty(poll.passphrase)) {
          setPassphrase(poll.passphrase, response.identifier)
        }
        history.push(`/${response.identifier}`)
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
  postPoll: PropTypes.func.isRequired,
  setPassphrase: PropTypes.func.isRequired,
  poll: PropTypes.shape({
    passphrase: PropTypes.string,
  }).isRequired,
}

export default Actions

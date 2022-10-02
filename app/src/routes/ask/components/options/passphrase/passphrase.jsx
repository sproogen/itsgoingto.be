import React from 'react'
import PropTypes from 'prop-types'
import './passphrase.scss'

const Passphrase = ({ poll, updateOptions }) => {
  const handlePassphraseChange = (event) => updateOptions({
    identifier: '',
    passphrase: event.target.value,
  })

  return (
    <div className="input-option input-option-passphrase">
      <label
        className="input-label input-label-passphrase"
        htmlFor="passphrase"
      >
        Set a passphrase (optional)
        <input
          className="input-field input-field-passphrase"
          type="text"
          id="passphrase"
          name="passphrase"
          value={poll.passphrase}
          onChange={handlePassphraseChange}
        />
      </label>
    </div>
  )
}

Passphrase.propTypes = {
  poll: PropTypes.shape({
    passphrase: PropTypes.string,
  }).isRequired,
  updateOptions: PropTypes.func.isRequired,
}

export default Passphrase

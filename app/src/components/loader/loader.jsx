import React from 'react'
import PropTypes from 'prop-types'
import './loader.scss'

const Loader = ({ isLoading }) => (
  isLoading ? (
    <div className="loader-container" data-testid="loader">
      <div className="loader">
        <p className="loader__label">?</p>
        <div className="loader__figure" />
      </div>
    </div>
  ) : null
)


Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
}

export default Loader

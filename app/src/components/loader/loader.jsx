import React from 'react'
import PropTypes from 'prop-types'
import './loader.scss'

const Loader = ({ isLoading }) => (
  <div className={`loader-container hideable ${isLoading ? '' : ' gone'}`}>
    <div className="loader">
      <p className="loader__label">?</p>
      <div className="loader__figure" />
    </div>
  </div>
)

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
}

export default Loader

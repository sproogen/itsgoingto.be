import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './loader.scss'

const Loader = ({ isLoading }) => (
  <div className={classNames('loader-container hideable', { gone: !isLoading })} data-testid="loader">
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

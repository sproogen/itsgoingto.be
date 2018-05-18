import React from 'react'
import PropTypes from 'prop-types'
import './Loader.scss'

export function Loader ({ isLoading }) {
  return (
    <div className={'loader-container hideable' + (isLoading ? '' : ' gone')}>
      <div className='loader'>
        <p className='loader__label'>?</p>
        <div className='loader__figure' />
      </div>
    </div>
  )
}

Loader.propTypes = {
  isLoading : PropTypes.bool.isRequired,
}

export default Loader

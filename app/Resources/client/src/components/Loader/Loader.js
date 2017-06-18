import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isLoadingSelector } from 'store/loader'
import './Loader.scss'

export const Loader = ({ isLoading }) => (
  <div className={'loader-container hideable' + (isLoading ? '' : ' gone')}>
    <div className='loader'>
      <p className='loader__label'>?</p>
      <div className='loader__figure' />
    </div>
  </div>
)

Loader.propTypes = {
  isLoading : PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  isLoading : isLoadingSelector(state),
})

export default connect(mapStateToProps)(Loader)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isLoadingSelector } from 'store/loader'
import { hasUserSelector } from 'store/user'
import Footer from 'layouts/Footer'
import Loader from 'components/Loader'
import './PageLayout.scss'

export function PageLayout ({ children, isLoading, hasUser }) {
  return (
    <div className='container'>
      <Loader isLoading={isLoading} />
      <div className='page-layout__viewport'>
        { hasUser && <div>LOGOUT</div> }
        {children}
      </div>
      <Footer />
    </div>
  )
}

PageLayout.propTypes = {
  children  : PropTypes.node,
  isLoading : PropTypes.bool.isRequired,
  hasUser   : PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  isLoading : isLoadingSelector(state),
  hasUser   : hasUserSelector(state),
})

export default connect(mapStateToProps)(PageLayout)

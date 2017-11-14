import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isLoadingSelector } from 'store/loader'
import Footer from 'layouts/Footer'
import Loader from 'components/Loader'
import './PageLayout.scss'

export function PageLayout ({ children, isLoading }) {
  return (
    <div className='container'>
      <div className='page-layout__viewport'>
        {children}
      </div>
      <Loader isLoading={isLoading} />
      <Footer />
    </div>
  )
}

PageLayout.propTypes = {
  children  : PropTypes.node,
  isLoading : PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  isLoading : isLoadingSelector(state),
})

export default connect(mapStateToProps)(PageLayout)

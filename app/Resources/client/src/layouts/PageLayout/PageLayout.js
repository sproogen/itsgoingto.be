import React from 'react'
import PropTypes from 'prop-types'
import Footer from '../../components/Footer/Footer'
import Loader from '../../components/Loader/Loader'
import './PageLayout.scss'

export const PageLayout = ({ children }) => (
  <div className='container'>
    <div className='page-layout__viewport'>
      {children}
    </div>
    <Loader />
    <Footer />
  </div>
)

PageLayout.propTypes = {
  children : PropTypes.node
}

export default PageLayout

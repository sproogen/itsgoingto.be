import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withCookies, Cookies } from 'react-cookie'
import { browserHistory } from 'react-router'
import { isLoadingSelector } from 'store/loader'
import { hasUserSelector, clearUser } from 'store/user'
import Footer from 'layouts/Footer'
import Loader from 'components/Loader'
import Button from 'components/Button'
import './PageLayout.scss'

export function PageLayout ({ children, isLoading, hasUser, clearUser, cookies }) {
  const submit = () => {
    clearUser()
    cookies.remove('itsgoingtobeUserToken', { path: '/' })
    return Promise.resolve()
  }

  const viewPolls = () => {
    browserHistory.push('/admin2')
  }

  return (
    <div className='container'>
      <Loader isLoading={isLoading} />
      <div className='page-layout__viewport'>
        { hasUser &&
          <div className='logout-conatiner'>
            <a className='view-polls' onClick={viewPolls}>View Polls</a>
            <Button className='btn--small' text='Logout' callback={submit} />
          </div>
        }
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
  clearUser : PropTypes.func.isRequired,
  cookies   : PropTypes.instanceOf(Cookies).isRequired,
}

const mapStateToProps = (state) => ({
  isLoading : isLoadingSelector(state),
  hasUser   : hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  clearUser : () => dispatch(clearUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(PageLayout))

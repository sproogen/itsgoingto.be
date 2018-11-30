import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withCookies, Cookies } from 'react-cookie'
import { browserHistory } from 'react-router'
import { isLoadingSelector } from 'store/loader/selectors'
import { hasUserSelector } from 'store/user/selectors'
import { clearUser } from 'store/user/actions'
import Footer from 'layouts/footer'
import Loader from 'components/loader'
import Button from 'components/button'
import './page-layout.scss'

export const PageLayout = ({ children, isLoading, hasUser, clearUser, cookies }) => {
  const logout = () => {
    clearUser()
    cookies.remove('itsgoingtobeUserToken', { path: '/' })
    browserHistory.push('/login')
    return Promise.resolve()
  }

  const viewPolls = () => {
    browserHistory.push('/admin')
  }

  return (
    <div className='container'>
      <Loader isLoading={isLoading} />
      <div className='page-layout__viewport'>
        { hasUser &&
          <div className='logout-conatiner'>
            <a id='view-polls' className='view-polls' onClick={viewPolls}>View Polls</a>
            <Button id='logout' className='btn--small' text='Logout' callback={logout} />
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

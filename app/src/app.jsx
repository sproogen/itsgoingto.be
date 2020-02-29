import React from 'react'
import { browserHistory, Router } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withCookies, Cookies } from 'react-cookie'
import { isLoadingSelector } from 'store/loader/selectors'
import { hasUserSelector } from 'store/user/selectors'
import { updateUser, clearUser as clearUserAction } from 'store/user/actions'
import Footer from 'components/footer'
import Loader from 'components/loader'
import Button from 'components/button'
import './app.scss'

class App extends React.Component {
  componentDidMount = () => {
    const { cookies, updateUserWithToken } = this.props
    const token = cookies.get('itsgoingtobeUserToken')

    if (token) {
      updateUserWithToken(token)
    }
  }

  logout = () => {
    const { cookies, clearUser } = this.props
    clearUser()
    cookies.remove('itsgoingtobeUserToken', { path: '/' })
    browserHistory.push('/login')
    return Promise.resolve()
  }

  viewPolls = () => {
    browserHistory.push('/admin')
  }

  render() {
    const { isLoading, hasUser } = this.props
    return (
      <div style={{ height: '100%' }}>
        <div className="container">
          <Loader isLoading={isLoading} />
          <div className="page-layout__viewport">
            { hasUser && (
              <div className="logout-conatiner">
                <button
                  type="button"
                  id="view-polls"
                  className="view-polls"
                  onClick={this.viewPolls}
                >
                  View Polls
                </button>
                <Button id="logout" className="btn--small" text="Logout" callback={this.logout} />
              </div>
            )}
            <Router history={browserHistory}>
              {/* TODO : Some routing */}
              { this.go() }
            </Router>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  isLoading : PropTypes.bool.isRequired,
  hasUser   : PropTypes.bool.isRequired,
  clearUser : PropTypes.func.isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  updateUserWithToken: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  isLoading : isLoadingSelector(state),
  hasUser   : hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  clearUser : () => dispatch(clearUserAction()),
  updateUserWithToken : (token) => dispatch(updateUser({ token })),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(App))

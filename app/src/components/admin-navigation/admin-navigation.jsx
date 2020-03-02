import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withCookies, Cookies } from 'react-cookie'
import { hasUserSelector } from 'store/user/selectors'
import { clearUser as clearUserAction } from 'store/user/actions'
import Button from 'components/button'

const AdminNavigation = ({ hasUser, clearUser, cookies }) => {
  const history = useHistory()

  const logout = () => {
    clearUser()
    cookies.remove('itsgoingtobeUserToken', { path: '/' })
    history.push('/login')
    return Promise.resolve()
  }

  const viewPolls = () => history.push('/admin')

  return (
    hasUser && (
      <div className="logout-conatiner">
        <button
          type="button"
          id="view-polls"
          className="view-polls"
          onClick={viewPolls}
        >
          View Polls
        </button>
        <Button id="logout" className="btn--small" text="Logout" callback={logout} />
      </div>
    )
  )
}

AdminNavigation.propTypes = {
  hasUser: PropTypes.bool.isRequired,
  clearUser: PropTypes.func.isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
}

const mapStateToProps = (state) => ({
  hasUser: hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  clearUser: () => dispatch(clearUserAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(AdminNavigation))

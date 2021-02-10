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
    cookies.remove('itsgoingtobeUserToken', { path: '/' })
    clearUser()
    return Promise.resolve()
  }

  const viewPolls = () => {
    history.push('/admin')
    return Promise.resolve()
  }

  return (
    hasUser && (
      <div className="logout-conatiner">
        <Button
          id="view-polls"
          className="btn--small"
          text="View Polls"
          callback={viewPolls}
        />
        <Button
          id="logout"
          className="btn--small"
          text="Logout"
          callback={logout}
        />
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

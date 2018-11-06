import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withCookies, Cookies } from 'react-cookie'
import { updateUser } from 'store/user/actions'

class App extends React.Component {
  shouldComponentUpdate = () => false

  componentDidMount = () => {
    const { cookies, updateUserWithToken } = this.props
    const token = cookies.get('itsgoingtobeUserToken')

    if (token) {
      updateUserWithToken(token)
    }
  }

  render = () => (
    <Provider store={this.props.store}>
      <div style={{ height: '100%' }}>
        <Router history={browserHistory}>
          {this.props.routes}
        </Router>
      </div>
    </Provider>
  )
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  updateUserWithToken: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  updateUserWithToken : (token) => dispatch(updateUser({ token }))
})

export default connect(null, mapDispatchToProps)(withCookies(App))

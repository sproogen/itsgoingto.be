import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withCookies, Cookies } from 'react-cookie'
import { updateUser } from 'store/user'

class App extends React.Component {
  static propTypes = {
    store  : PropTypes.object.isRequired,
    routes : PropTypes.object.isRequired,
    cookies : PropTypes.instanceOf(Cookies).isRequired,
    updateUserWithToken : PropTypes.func.isRequired,
  }

  shouldComponentUpdate = () => false

  componentWillMount = () => {
    const { cookies, updateUserWithToken } = this.props
    const token = cookies.get('itsgoingtobeUserToken')

    if (token) {
      updateUserWithToken(token)
    }
  }

  render = () => (
    <Provider store={this.props.store}>
      <div style={{ height: '100%' }}>
        <Router history={browserHistory} children={this.props.routes} />
      </div>
    </Provider>
  )
}

const mapDispatchToProps = (dispatch) => ({
  updateUserWithToken : (token) => dispatch(updateUser({ token }))
})

export default connect(null, mapDispatchToProps)(withCookies(App))

import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { postLogin } from 'services/api'
import { hasUserSelector } from 'store/user/selectors'
import { clearUser } from 'store/user/actions'
import { setLoading } from 'store/loader/actions'

import Login from './login'

const mapStateToProps = (state) => ({
  hasUser: hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  postLogin: (username, password) => dispatch(postLogin(username, password)),
  setLoading: (value) => dispatch(setLoading(value)),
  clearUser: () => dispatch(clearUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Login))

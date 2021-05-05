import { connect } from 'react-redux'
import { isLoadingSelector } from 'store/loader/selectors'
import { updateUser } from 'store/user/actions'
import App from './app'

const mapStateToProps = (state) => ({
  isLoading: isLoadingSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  updateUserWithToken: (token) => dispatch(updateUser({ token })),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

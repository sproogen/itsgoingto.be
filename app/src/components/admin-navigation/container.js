import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { hasUserSelector } from 'store/user/selectors'
import { clearUser } from 'store/user/actions'
import AdminNavigation from './admin-navigation'

const mapStateToProps = (state) => ({
  hasUser: hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  clearUser: () => dispatch(clearUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(AdminNavigation))

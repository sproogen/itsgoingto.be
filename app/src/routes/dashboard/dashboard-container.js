import { connect } from 'react-redux'
import { hasUserSelector } from 'store/user/selectors'
import { setLoading } from 'store/loader/actions'

import Dashboard from './dashboard'

const mapStateToProps = (state) => ({
  hasUser: hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  setLoading: (value) => dispatch(setLoading(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
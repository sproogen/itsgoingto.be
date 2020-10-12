import { connect } from 'react-redux'
import { fetchStats } from 'services/api'
import { statSelector } from 'store/stats/selectors'

import Stats from './stats'

const mapStateToProps = (state) => ({
  polls: statSelector(state, 'polls'),
  responses: statSelector(state, 'responses'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchStats: () => dispatch(fetchStats()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Stats)
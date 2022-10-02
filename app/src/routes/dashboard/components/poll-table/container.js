import { connect } from 'react-redux'
import { fetchPolls, deletePoll } from 'services/api'
import { pollsSelector, pollCountSelector, pollPageSelector } from 'store/poll/selectors'
import { setPollPage } from 'store/poll/actions'

import PollTable from './poll-table'

const mapStateToProps = (state) => ({
  polls: pollsSelector(state, true),
  pollCount: pollCountSelector(state),
  page: pollPageSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPolls: (page, sort, sortDirection) => dispatch(fetchPolls(page, sort, sortDirection)),
  setPollPage: (page) => dispatch(setPollPage(page)),
  deletePoll: (identifier) => dispatch(deletePoll(identifier)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PollTable)

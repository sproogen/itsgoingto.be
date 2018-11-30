import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CancelablePromise from 'cancelable-promise'
import { fetchPolls, deletePoll } from 'services/api'
import { pollsSelector, pollCountSelector, pollPageSelector } from 'store/poll/selectors'
import { POLLS_PER_PAGE } from 'store/poll'
import Spinner from 'components/spinner'
import PollTableRow from './poll-table-row'
import Paginator from '../paginator'
import './poll-table.scss'

let fetchPollsPromise

class PollTable extends React.Component {
  constructor (props) {
    super(props)

    const { pollPage, pollCount } = props

    // TODO : Store ID's of polls for the page in a dashboard store
    // Also store the page number in the dashboard store
    this.state = {
      page    : pollPage,
      loading : pollCount === 0
    }
  }

  componentDidMount = () => {
    const { page } = this.state

    this.fetchPollsForPage(page)
  }

  componentWillUnmount = () => {
    fetchPollsPromise.cancel()
  }

  fetchPollsForPage = (page) => {
    const { fetchPolls } = this.props

    fetchPollsPromise = new CancelablePromise(
      (resolve) => fetchPolls(page + 1).then(resolve)
    )
    fetchPollsPromise.then(() => {
      this.setState({ loading : false })
    })
  }

  changePage = (page) => {
    fetchPollsPromise.cancel()
    this.setState({ page, loading : true }, () => this.fetchPollsForPage(page))
  }

  render () {
    const { loading, page } = this.state
    const { polls, pollCount, deletePoll } = this.props
    const hasPaginator = Math.ceil(pollCount / POLLS_PER_PAGE) > 1

    return (
      <div className='panel'>
        <div className='panel-header'>
          Polls
        </div>
        <div className='panel-body'>
          {loading &&
            <div className={'spinner-container center-text' + (!hasPaginator ? ' no-paginator' : '')}>
              <Spinner />
            </div>
          }
          <div className={'table-container' + (loading ? ' hidden' : '')}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '4em' }}>ID</th>
                  <th style={{ width: '8em' }}>Identifier</th>
                  <th>Question</th>
                  <th style={{ width: '8em' }}>Responses</th>
                  <th style={{ width: '8em' }}>Status</th>
                  <th style={{ width: '12em' }}>Created At</th>
                  <th style={{ width: '4em' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  polls.map((poll) => (
                    <PollTableRow key={poll.id} poll={poll} deletePoll={deletePoll} />
                  ))
                }
              </tbody>
            </table>
          </div>
          <Paginator
            itemCount={pollCount}
            itemsPerPage={POLLS_PER_PAGE}
            page={page}
            pageCallback={this.changePage}
          />
        </div>
      </div>
    )
  }
}

PollTable.propTypes = {
  polls      : PropTypes.array.isRequired,
  pollCount  : PropTypes.number.isRequired,
  pollPage   : PropTypes.number.isRequired,
  fetchPolls : PropTypes.func.isRequired,
  deletePoll : PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  polls     : pollsSelector(state, true),
  pollCount : pollCountSelector(state),
  pollPage  : pollPageSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  fetchPolls : (page) => dispatch(fetchPolls(page)),
  deletePoll : (identifier) => dispatch(deletePoll(identifier))
})

export default connect(mapStateToProps, mapDispatchToProps)(PollTable)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchPolls } from 'store/api'
import { pollsSelector, pollCountSelector, POLLS_PER_PAGE } from 'store/poll'
import Spinner from 'components/Spinner'
import PollTableRow from '../PollTableRow'
import Paginator from '../Paginator'
import './PollTable.scss'

class PollTable extends React.Component {
  constructor (props) {
    super(props)

    // TODO : Store page for fetched polls in state
    // If initial page (also get from URL) = stored page don't show loading.
    this.state = {
      page : 0,
      loading : true
    }
  }

  componentWillMount = () => {
    const { page } = this.state

    this.fetchPollsForPage(page)
  }

  fetchPollsForPage = (page) => {
    const { fetchPolls } = this.props

    fetchPolls(page + 1)
    .then(() => {
      this.setState({ loading : false })
    })
  }

  changePage = (page) => {
    // TODO : Set page number as URL parameter
    this.setState({ page, loading : true }, () => this.fetchPollsForPage(page))
  }

  render () {
    const { loading, page } = this.state
    const { polls, pollCount } = this.props
    const hasPaginator = Math.ceil(pollCount / POLLS_PER_PAGE) > 1

    const pollItems = polls.map((poll) =>
      <div key={poll.id}>
        {poll.question}
      </div>
    )

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
                  <th>ID</th>
                  <th>Identifier</th>
                  <th>Question</th>
                  <th>Created At</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  polls.map((poll) => (
                    <PollTableRow key={poll.id} poll={poll} />
                  ))
                }
              </tbody>
            </table>
          </div>
          <Paginator
            pollCount={pollCount}
            pollsPerPage={POLLS_PER_PAGE}
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
  fetchPolls : PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  polls     : pollsSelector(state),
  pollCount : pollCountSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPolls : (page) => dispatch(fetchPolls(page))
})

export default connect(mapStateToProps, mapDispatchToProps)(PollTable)

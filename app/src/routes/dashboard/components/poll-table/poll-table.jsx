import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import CancelablePromise from 'cancelable-promise'
import { fetchPolls, deletePoll } from 'services/api'
import { pollsSelector, pollCountSelector, pollPageSelector } from 'store/poll/selectors'
import { setPollPage } from 'store/poll/actions'
import { POLLS_PER_PAGE } from 'store/poll'
import Spinner from 'components/spinner'
import PollTableRow from './poll-table-row'
import PollTableHeaderItem from './poll-table-header-item'
import Paginator from '../paginator'
import './poll-table.scss'

let fetchPollsPromise

class PollTable extends React.Component {
  constructor (props) {
    super(props)

    const { pollCount } = props

    // TODO : Store ID's of polls for the page in a dashboard store
    this.state = {
      loading       : pollCount === 0,
      sort          : 'id',
      sortDirection : 'desc',
    }
  }

  componentDidMount = () => {
    const { page } = this.props

    this.fetchPollsForPage(page)
  }

  componentWillUnmount = () => {
    fetchPollsPromise.cancel()
  }

  fetchPollsForPage = (page) => {
    const { sort, sortDirection } = this.state
    const { fetchPolls, setPollPage } = this.props

    setPollPage(page)
    fetchPollsPromise = new CancelablePromise(
      (resolve) => fetchPolls(page + 1, sort, sortDirection).then(resolve)
    )
    fetchPollsPromise.then(() => {
      this.setState({ loading : false })
    })
  }

  changePage = (page) => {
    fetchPollsPromise.cancel()
    this.setState({ loading : true }, () => this.fetchPollsForPage(page))
  }

  changeSort = (newSort) => {
    const { page } = this.props

    this.setState(({ sort, sortDirection }) => (
      {
        sort: newSort,
        sortDirection: equals(sort, newSort) && equals('asc', sortDirection) ? 'desc' : 'asc',
        loading: true,
      }
    ), () => this.fetchPollsForPage(page))
  }

  render () {
    const { loading, sort, sortDirection } = this.state
    const { polls, pollCount, deletePoll, page } = this.props
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
                  <PollTableHeaderItem
                    label='ID'
                    style={{ width: '4em' }}
                    onSort={() => this.changeSort('id')}
                    sortDirection={equals('id', sort) && sortDirection}
                  />
                  <PollTableHeaderItem
                    label='Identifier'
                    style={{ width: '8em' }}
                    onSort={() => this.changeSort('identifier')}
                    sortDirection={equals('identifier', sort) && sortDirection}
                  />
                  <PollTableHeaderItem
                    label='Question'
                    onSort={() => this.changeSort('question')}
                    sortDirection={equals('question', sort) && sortDirection}
                  />
                  <PollTableHeaderItem
                    label='Responses'
                    style={{ width: '8em' }}
                    onSort={() => this.changeSort('responsesCount')}
                    sortDirection={equals('responsesCount', sort) && sortDirection}
                  />
                  <PollTableHeaderItem
                    label='Status'
                    style={{ width: '8em' }} />
                  <PollTableHeaderItem
                    label='Created At'
                    style={{ width: '12em' }}
                    onSort={() => this.changeSort('created')}
                    sortDirection={equals('created', sort) && sortDirection}
                  />
                  <PollTableHeaderItem
                    label='Delete'
                    style={{ width: '4em' }}
                  />
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
  polls       : PropTypes.array.isRequired,
  pollCount   : PropTypes.number.isRequired,
  page        : PropTypes.number.isRequired,
  fetchPolls  : PropTypes.func.isRequired,
  setPollPage : PropTypes.func.isRequired,
  deletePoll  : PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  polls     : pollsSelector(state, true),
  pollCount : pollCountSelector(state),
  page      : pollPageSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  fetchPolls  : (page, sort, sortDirection) => dispatch(fetchPolls(page, sort, sortDirection)),
  setPollPage : (page) => dispatch(setPollPage(page)),
  deletePoll  : (identifier) => dispatch(deletePoll(identifier))
})

export default connect(mapStateToProps, mapDispatchToProps)(PollTable)

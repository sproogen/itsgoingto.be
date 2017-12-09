import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchPolls } from 'store/api'
import { pollsSelector, pollCountSelector, POLLS_PER_PAGE } from 'store/poll'
import Spinner from 'components/Spinner'
import './PollTable.scss'

class PollTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page : 0,
      loading : true
    }
  }

  componentWillMount = () => {
    const { page } = this.state

    // TODO : Remove polls from state

    this.fetchPollsForPage(page)
  }

  fetchPollsForPage = (page) => {
    const { fetchPolls } = this.props

    fetchPolls(page + 1)
    .then(() => {
      this.setState({ loading : false })
    })
  }

  changePage = (page) => () => {
    this.setState({ page, loading : true }, () => this.fetchPollsForPage(page))
  }

  renderPaginationButton = (key, text, disabled, callback) => {
    return (
      <button
        key={key}
        disabled={disabled}
        className={'btn btn-pagination' + (disabled ? ' disabled' : '')}
        onClick={callback}>
        {text}
      </button>
    )
  }

  renderPagination = () => {
    const { pollCount } = this.props
    const { page } = this.state
    const pageCount = Math.ceil(pollCount / POLLS_PER_PAGE)

    let pages = [];
    for (var i = 0; i < pageCount; i++) {
        pages.push(this.renderPaginationButton(i, i+1, i === page, this.changePage(i)));
    }

    return (
      <div className='pagination-container'>
        {pageCount > 1 ?
          <div>
            {this.renderPaginationButton('previous', 'PREVIOUS', page <= 0, this.changePage(page - 1))}
            {pages}
            {this.renderPaginationButton('next', 'NEXT', page >= pageCount - 1, this.changePage(page + 1))}
          </div> :
          null
        }
      </div>
    )
  }

  render () {
    const { loading } = this.state
    const { polls } = this.props

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
            <div className='center-text'>
              <Spinner />
            </div>
          }
          {!loading &&
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
                { //TODO : Poll row component
                  polls.map(({id, identifier, question, created}) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{identifier}</td>
                      <td>{question}</td>
                      <td>{created.date}</td>
                      <td>X</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          }
          {/* TODO : Pagination Component */}
          {this.renderPagination()}
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

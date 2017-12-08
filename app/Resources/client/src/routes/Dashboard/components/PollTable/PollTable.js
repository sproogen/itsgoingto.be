import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchPolls } from 'store/api'
import { pollsSelector } from 'store/poll'
import Spinner from 'components/Spinner'
import './PollTable.scss'

class PollTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page : 1,
      loading : true
    }
  }

  componentWillMount = () => {
    const { fetchPolls } = this.props
    const { page } = this.state

    // TODO : Remove polls from state

    fetchPolls(page)
    .then(() => {
      this.setState({ loading : false })
    })
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
            <div>
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
              {/*TODO : Pagination*/}
            </div>
          }
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
  polls : pollsSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPolls : (page) => dispatch(fetchPolls(page))
})

export default connect(mapStateToProps, mapDispatchToProps)(PollTable)

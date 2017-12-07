import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchPolls } from 'store/api'

class Polls extends React.Component {
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
    return (
      <div className='panel'>
        <div className='panel-header'>
          Polls
        </div>
        <div className='panel-body'>
          {/*TODO : Show loading or table of polls*/}
        </div>
      </div>
    )
  }
}

Polls.propTypes = {
  fetchPolls : PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  fetchPolls : (page) => dispatch(fetchPolls(page))
})

export default connect(null, mapDispatchToProps)(Polls)

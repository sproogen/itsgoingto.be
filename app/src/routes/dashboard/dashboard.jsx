import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { hasUserSelector } from 'store/user/selectors'
import { setLoading } from 'store/loader/actions'
import PollTable from './components/poll-table'
import Stats from './components/stats'
import './dashboard.scss'

class Dashboard extends React.Component {
  componentDidMount = () => this.checkPermissions()

  componentDidUpdate = () => this.checkPermissions()

  checkPermissions = () => {
    const { hasUser } = this.props

    if (!hasUser) {
      this.props.setLoading(true)
      browserHistory.push('/login')
    } else {
      this.props.setLoading(false)
    }
  }

  render () {
    const { hasUser } = this.props

    if (hasUser) {
      return (
        <div>
          <div className='container info-container'>
            <Stats />
          </div>
          <div className='container panel-container'>
            <PollTable />
          </div>
        </div>
      )
    }

    return <div />
  }
}

Dashboard.propTypes = {
  hasUser    : PropTypes.bool.isRequired,
  setLoading : PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  hasUser : hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  setLoading : (value) => dispatch(setLoading(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)

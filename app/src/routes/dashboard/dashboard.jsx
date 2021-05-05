import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import PollTable from './components/poll-table'
import Stats from './components/stats'
import './dashboard.scss'

const Dashboard = ({ hasUser, setLoading }) => {
  const history = useHistory()

  useEffect(() => {
    if (!hasUser) {
      setLoading(true)
      history.push('/login')
    } else {
      setLoading(false)
    }
  }, [hasUser])

  return (
    hasUser ? (
      <div>
        <div className="container info-container">
          <Stats />
        </div>
        <div className="container panel-container">
          <PollTable />
        </div>
      </div>
    ) : <div />
  )
}

Dashboard.propTypes = {
  hasUser: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
}

export default Dashboard

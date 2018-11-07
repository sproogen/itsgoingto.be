import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isNil } from 'ramda'
import { fetchStats } from 'services/api'
import { statSelector } from 'store/stats/selectors'
import './stats.scss'

class Stats extends React.Component {
  componentDidMount = () => {
    const { fetchStats } = this.props

    fetchStats()
  }

  render() {
    const { polls, responses } = this.props

    return (
      <div className='info'>
        <div className='info-block-column'>
          <div className='info-block'>
            <div className='info-header'>
              Total Polls
            </div>
            <div className='info-body'>
              {!isNil(polls) ? polls : '-'}
            </div>
          </div>
        </div>
        <div className='info-block-column'>
          <div className='info-block'>
            <div className='info-header'>
              Total Responses
            </div>
            <div className='info-body'>
              {!isNil(responses) ? responses : '-'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Stats.propTypes = {
  polls      : PropTypes.number,
  responses  : PropTypes.number,
  fetchStats : PropTypes.func.isRequired,
}

Stats.defaultProps = {
  polls     : undefined,
  responses : undefined,
}

const mapStateToProps = (state) => ({
  polls     : statSelector(state, 'polls'),
  responses : statSelector(state, 'responses'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchStats : () => dispatch(fetchStats()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Stats)
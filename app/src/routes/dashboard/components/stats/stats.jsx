import React, { Component, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'
import './stats.scss'

const Stats = ({ polls, responses, fetchStats }) => {
  useEffect(fetchStats, [])

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

Stats.propTypes = {
  polls: PropTypes.number,
  responses: PropTypes.number,
  fetchStats: PropTypes.func.isRequired,
}

Stats.defaultProps = {
  polls: null,
  responses: null,
}

export default Stats
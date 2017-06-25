import React from 'react'
import { browserHistory } from 'react-router'
import './Back.scss'

export const Back = () => {
  const submit = () => {
    browserHistory.push('/')
  }

  return (
    <div className='container back-container'>
      <div className='back-button'>
        <a onClick={submit}>
          <i className='fa fa-arrow-left' /> New Poll
        </a>
      </div>
    </div>
  )
}

export default Back

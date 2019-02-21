import React from 'react'
import { browserHistory } from 'react-router'
import './back.scss'

export function Back () {
  const submit = () => {
    browserHistory.push('/')
  }

  let abc = 1
  console.log('hi')

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

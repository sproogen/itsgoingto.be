import React from 'react'
import Back from 'components/Back/Back'
import './NotFound.scss'

export const NotFound = () => (
  <div>
    <Back />
    <div className='container header-container answer-header-container'>
      <div className='header center-text'>
        <h1 className='not-found'>
          Oh no!<br />
          <span>It looks like we couldn't find that poll.</span>
        </h1>
      </div>
    </div>
  </div>
)

export default NotFound

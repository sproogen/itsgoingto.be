import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './AskView.scss'

export const AskView = () => (
  <div>
    <h4>Ask a question!</h4>
    <img alt='This is a duck, because Redux!' className='duck' src={DuckImage} />
  </div>
)

export default AskView

import React from 'react'
import WordRotate from '../../components/WordRotate/WordRotate'
import './AskView.scss'

export const AskView = () => (
  <div>
    <div className='container header-container'>
      <div className='header center-text'>
        <h1><WordRotate words='What,Where,When' /> is it going to be?</h1>
      </div>
    </div>
    <div className='container question-container'>
      <span className='input input-question'>
        <label className='input-label input-label-question' htmlFor='question'>Ask a question</label>
        <textarea className='input-field input-field-question js-auto-size' rows='1' id='question' name='question' />
      </span>
    </div>
  </div>
)

export default AskView

import React from 'react'
import { browserHistory } from 'react-router'
import './Back.scss'

class Back extends React.Component {
  submit = () => {
    browserHistory.push('/react')
  }

  render = () => (
    <div className="container back-container">
      <div className="back-button">
        <a onClick={ this.submit }>
          <i className="fa fa-arrow-left"></i> New Poll
        </a>
      </div>
    </div>
  )
}

export default Back

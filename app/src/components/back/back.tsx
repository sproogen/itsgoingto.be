import React from 'react'
import { Link } from 'react-router-dom'
import './back.scss'

const Back = (): React.ReactElement => (
  <div className="back-container">
    <div className="back-button">
      <Link to="/">
        <i className="fa fa-arrow-left" />
        New Poll
      </Link>
    </div>
  </div>
)

export default Back

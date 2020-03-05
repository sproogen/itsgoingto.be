import React from 'react'
import './spinner.scss'

const Spinner = () => (
  <div className="spinner">
    <span className="spinner_dot spinner_dot--first" />
    <span className="spinner_dot spinner_dot--second" />
    <span className="spinner_dot spinner_dot--third" />
  </div>
)

export default Spinner

import React from 'react'
import PropTypes from 'prop-types'

class Time extends React.Component {
  constructor (props) {
    super(props)
  }

  handleClickOutside = (event) => {
    this.props.onClickOutside(event)
  }

  render () {
    return (
      <div>
        Time picker popup content
      </div>
    )
  }
}

Time.propTypes = {
}

Time.defaultProps = {
}

export default Time

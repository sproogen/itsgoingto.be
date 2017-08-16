import React from 'react'
import { browserHistory } from 'react-router'

export class CatchAll extends React.Component {
  constructor (props) {
    super(props)
    browserHistory.push('/404')
  }

  render () {
    return (
      <div />
    )
  }
}

export default CatchAll

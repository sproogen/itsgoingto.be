import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { postPoll } from 'services/api'
import Button from 'components/button'
import './actions.scss'

export class Actions extends React.Component {
  submit = () => this.props.postPoll()
    .then((response) => {
      if (response !== false) {
        browserHistory.push('/' + response.identifier)
        return false
      }
      return true
    })

  render () {
    const { hasQuestion, canSubmitPoll } = this.props

    return (
      <div>
        <div className={'actions hideable' + (hasQuestion ? '' : ' gone')}>
          <Button className='pull-right' text='Create Poll' disabled={!canSubmitPoll} callback={this.submit} />
        </div>
      </div>
    )
  }
}

Actions.propTypes = {
  hasQuestion   : PropTypes.bool.isRequired,
  canSubmitPoll : PropTypes.bool.isRequired,
  postPoll      : PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  postPoll : () => dispatch(postPoll())
})

export default connect(null, mapDispatchToProps)(Actions)

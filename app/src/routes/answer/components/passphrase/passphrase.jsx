import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { mergeAll } from 'ramda'
import { updatePoll } from 'store/poll'
import { fetchPoll, APIError } from 'store/api'
import { setRequiresPassphrase } from 'store/loader'
import EventBus from 'components/event-bus'
import Button from 'components/button'
import './passphrase.scss'

const KEY_ENTER = 13

class Passphrase extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error : false
    }
  }

  componentDidMount = () => {
    this.eventBus = EventBus.getEventBus()
  }

  submit = () =>
    this.props.setPassphrase(this.refs.passphrase.value)
      .then(
        () => this.props.fetchPoll(this.props.identifier)
          .then((response) => {
            if (!(response instanceof APIError)) {
              this.props.setRequiresPassphrase(false)
            } else {
              this.setState({
                error : true
              })
            }
          })
      )

  handleKeyPress = (event) => {
    event = event || window.event
    const key = event.keyCode || event.charCode

    if (key === KEY_ENTER) {
      this.eventBus.emit('passphrase-submit')
    }
  }

  render () {
    const { error } = this.state

    return (
      <div className='passphrase-container'>
        <div className={'input-passphrase' + (error ? ' input-error' : '')}>
          <label className='input-label input-label-passphrase' htmlFor='passphrase'>Passphrase</label>
          <input
            className='input-field input-field-passphrase'
            type='text'
            id='passphrase'
            name='passphrase'
            ref='passphrase'
            onKeyDown={this.handleKeyPress} />
          {error &&
            <span className='input-error-label'>
              Passphrase incorrect
            </span>
          }
        </div>
        <Button className='btn pull-right' text='Enter' callback={this.submit} submitEvent='passphrase-submit' />
      </div>
    )
  }
}

Passphrase.propTypes = {
  identifier            : PropTypes.string.isRequired,
  setPassphrase         : PropTypes.func.isRequired,
  fetchPoll             : PropTypes.func.isRequired,
  setRequiresPassphrase : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, props) => ({
  setPassphrase         : (value) => dispatch(updatePoll({ passphrase : value, identifier : props.params.identifier })),
  fetchPoll             : (identifier) => dispatch(fetchPoll(identifier)),
  setRequiresPassphrase : (value) => dispatch(setRequiresPassphrase(value))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default withRouter(connect(null, mapDispatchToProps, mergeProps)(Passphrase))

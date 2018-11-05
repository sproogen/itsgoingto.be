import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import Helmet from 'react-helmet'
import Linkify from 'react-linkify'
import Countdown from 'react-countdown-now'
import { browserHistory } from 'react-router'
import io from 'socket.io-client'
import { fetchPoll, postResponse, APIError } from 'services/api'
import { pollSelector, hasQuestionSelector, totalResponsesSelector, userRespondedSelector,
  updateResponses } from 'store/poll'
import { answersSelector, clearAnswers } from 'store/answers'
import { setLoading, setRequiresPassphrase, requiresPassphraseSelector } from 'store/loader'
import { hasUserSelector } from 'store/user'
import Back from 'components/back'
import Sharing from './components/sharing'
import Answers from './components/answers'
import Passphrase from './components/passphrase'
import './answer.scss'

class Answer extends React.Component {
  componentDidMount = () => {
    const { hasPoll, setLoading, fetchPoll, clearAnswers, setRequiresPassphrase } = this.props

    if (!hasPoll) {
      setLoading(true)
    }
    clearAnswers()
    fetchPoll().then((response) => {
      if (response instanceof APIError) {
        if (response.details.status === 403 && response.details.error.error === 'incorrect-passphrase') {
          setRequiresPassphrase(true)
        } else {
          browserHistory.push('/404')
        }
      }
      setLoading(false)
    })
  }

  componentDidUpdate = () => {
    const { hasPoll, poll, identifier, updateResponses } = this.props
    if (hasPoll && !this.socket && !poll.ended) {
      this.socket = io(`/responses?identifier=${identifier}`)
      this.socket.on('responses-updated', (responses) => {
        updateResponses(JSON.parse(responses))
      })
    }
  }

  componentWillUnmount = () => {
    if (this.socket) {
      this.socket.close()
    }
  }

  onResponseSelected = (id) => {
    const { postResponse } = this.props
    postResponse(id)
  }

  hasValue = (value) => value && value !== '00'

  valueLabel = (value, label) => `${parseInt(value, 10)} ${label}${parseInt(value, 10) > 1 ? 's' : ''}`

  twoValueString = (value1, value2, label1, label2) =>
    `${this.valueLabel(value1, label1)} and ${this.valueLabel(value2, label2)}`

  countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    const { poll, fetchPoll } = this.props
    let ending = ''

    if (completed) {
      if (!poll.ended) {
        fetchPoll()
      }
      ending = 'This poll has now ended'
    } else {
      ending = 'This poll will end in '

      if (this.hasValue(days)) ending += this.twoValueString(days, hours, 'day', 'hour')
      else if (this.hasValue(hours)) ending += this.twoValueString(hours, minutes, 'hour', 'minute')
      else if (this.hasValue(minutes)) ending += this.twoValueString(minutes, seconds, 'minute', 'second')
      else ending += this.valueLabel(seconds, 'second')
    }

    return <span>{ending}</span>
  }

  render () {
    const { hasPoll, poll, requiresPassphrase, answers, totalResponses, userResponded, hasUser } = this.props

    return (
      <div>
        <Helmet>
          <meta charSet='utf-8' />
          <title>{ poll.question }</title>
          <meta name='description' content='Join in the vote and answer this poll at itsgoingto.be' />
          <meta name='keywords' content='question vote poll result' />
        </Helmet>
        { hasPoll &&
          <div>
            <Back />
            <div className='container header-container answer-header-container'>
              <div className='header center-text'>
                <h2><Linkify properties={{ target: '_blank' }}>{ poll.question }</Linkify></h2>
                <Sharing poll={poll} />
                { poll.ended &&
                  <div className='alert alert-success'><span>This poll has now ended</span></div>
                }
                { poll.endDate && !poll.ended &&
                  <div className='alert alert-success'>
                    <Countdown
                      date={poll.endDate.date}
                      renderer={this.countdownRenderer} />
                  </div>
                }
              </div>
            </div>
            <Answers
              poll={poll}
              answers={answers}
              totalResponses={totalResponses}
              userResponded={userResponded}
              onResponseSelected={this.onResponseSelected}
              viewOnly={hasUser} />
          </div>
        }
        { requiresPassphrase &&
          <Passphrase />
        }
      </div>
    )
  }
}

Answer.propTypes = {
  identifier            : PropTypes.string.isRequired,
  poll                  : PropTypes.object.isRequired,
  hasPoll               : PropTypes.bool.isRequired,
  requiresPassphrase    : PropTypes.bool.isRequired,
  answers               : PropTypes.array.isRequired,
  totalResponses        : PropTypes.number,
  userResponded         : PropTypes.bool.isRequired,
  hasUser               : PropTypes.bool.isRequired,
  fetchPoll             : PropTypes.func.isRequired,
  clearAnswers          : PropTypes.func.isRequired,
  setLoading            : PropTypes.func.isRequired,
  setRequiresPassphrase : PropTypes.func.isRequired,
  postResponse          : PropTypes.func.isRequired,
  updateResponses       : PropTypes.func.isRequired
}

Answer.defaultProps = {
  totalResponses : 0
}

const mapStateToProps = (state, props) => ({
  poll               : pollSelector(state, props.params.identifier),
  hasPoll            : hasQuestionSelector(state, props.params.identifier),
  requiresPassphrase : requiresPassphraseSelector(state),
  answers            : answersSelector(state),
  totalResponses     : totalResponsesSelector(state, props.params.identifier),
  userResponded      : userRespondedSelector(state, props.params.identifier),
  hasUser            : hasUserSelector(state),
})

const mapDispatchToProps = (dispatch, props) => ({
  fetchPoll             : () => dispatch(fetchPoll(props.params.identifier)),
  clearAnswers          : () => dispatch(clearAnswers()),
  setLoading            : (value) => dispatch(setLoading(value)),
  setRequiresPassphrase : (value) => dispatch(setRequiresPassphrase(value)),
  postResponse          : (id) => dispatch(postResponse(id, props.params.identifier)),
  updateResponses       : (responses) => dispatch(updateResponses(responses, props.params.identifier))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Answer)

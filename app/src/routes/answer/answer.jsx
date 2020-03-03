import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import Helmet from 'react-helmet'
import Linkify from 'react-linkify'
import Countdown from 'react-countdown-now'
import { useHistory } from 'react-router-dom'
import { withCookies, Cookies } from 'react-cookie'
import io from 'socket.io-client'
import { fetchPoll, postResponse, APIError } from 'services/api'
import {
  pollSelector, hasQuestionSelector, totalResponsesSelector, userRespondedSelector
} from 'store/poll/selectors'
import { updateResponses, updateUserResponses } from 'store/poll/actions'
import { answersSelector } from 'store/answers/selectors'
import { clearAnswers } from 'store/answers/actions'
import { requiresPassphraseSelector } from 'store/loader/selectors'
import { setLoading, setRequiresPassphrase } from 'store/loader/actions'
import { hasUserSelector } from 'store/user/selectors'
import Back from 'components/back'
import Sharing from './components/sharing'
import Answers from './components/answers'
import Passphrase from './components/passphrase'
import './answer.scss'

const Answer = ({
  hasPoll, poll, setLoading, fetchPoll, clearAnswers, setRequiresPassphrase, postResponse, requiresPassphrase
}) => {
  const history = useHistory()

  useEffect(() => {
    if (!hasPoll) {
      setLoading(true)
    }
    clearAnswers()
    fetchPoll().then((response) => {
      if (response instanceof APIError) {
        if (response.details.status === 403 && response.details.error.error === 'incorrect-passphrase') {
          setRequiresPassphrase(true)
        } else {
          history.push('/404')
        }
      }
      setLoading(false)
    })
  }, [])

  // componentDidUpdate = () => {
  //   const { hasPoll, poll, identifier, updateResponses, updateUserResponses, cookies } = this.props

  //   if (hasPoll && !this.socket && !poll.ended) {

  //     let userID = cookies.get('USERID')

  //     if (!userID) {
  //       userID = [...Array(20)].map(() => (Math.random() * 36 | 0).toString(36)).join``
  //       cookies.set('USERID', userID, { path: '/' })
  //     }

  //     this.socket = io(`/responses?identifier=${identifier}&USERID=${userID}`)
  //     this.socket.on('responses-updated', (responses) => {
  //       updateResponses(JSON.parse(responses))
  //     })
  //     this.socket.on('own-responses-updated', (responses) => {
  //       updateUserResponses(JSON.parse(responses))
  //     })
  //   }
  // }

  // componentWillUnmount = () => {
  //   if (this.socket) {
  //     this.socket.close()
  //   }
  // }

  const onResponseSelected = (id) => postResponse(id)

  const hasValue = (value) => value && value !== '00'

  const valueLabel = (value, label) => `${parseInt(value, 10)} ${label}${parseInt(value, 10) > 1 ? 's' : ''}`

  const twoValueString = (value1, value2, label1, label2) => `${this.valueLabel(value1, label1)} and ${this.valueLabel(value2, label2)}`

  const countdownRenderer = ({
    days, hours, minutes, seconds, completed
  }) => {
    let ending = ''

    if (completed) {
      if (!poll.ended) {
        fetchPoll()
      }
      ending = 'This poll has now ended'
    } else {
      ending = 'This poll will end in '

      if (hasValue(days)) {
        ending += twoValueString(days, hours, 'day', 'hour')
      } else if (hasValue(hours)) {
        ending += twoValueString(hours, minutes, 'hour', 'minute')
      } else if (hasValue(minutes)) {
        ending += twoValueString(minutes, seconds, 'minute', 'second')
      } else {
        ending += valueLabel(seconds, 'second')
      }
    }

    return <span>{ending}</span>
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{ poll.question }</title>
        <meta name="description" content="Join in the vote and answer this poll at itsgoingto.be" />
        <meta name="keywords" content="question vote poll result" />
      </Helmet>
      { hasPoll && (
        <div>
          <Back />
          <div className="container header-container answer-header-container">
            <div className="header center-text">
              <h2><Linkify properties={{ target: '_blank' }}>{ poll.question }</Linkify></h2>
              <Sharing poll={poll} />
              { poll.ended && (
                <div className="alert alert-success"><span>This poll has now ended</span></div>
              )}
              { poll.endDate && !poll.ended && (
                <div className="alert alert-success">
                  <Countdown
                    date={poll.endDate.date}
                    renderer={countdownRenderer}
                  />
                </div>
              )}
            </div>
          </div>
          <Answers
            poll={poll}
            answers={answers}
            totalResponses={totalResponses}
            userResponded={userResponded}
            onResponseSelected={onResponseSelected}
            viewOnly={hasUser}
          />
        </div>
      )}
      { requiresPassphrase && <Passphrase /> }
    </div>
  )
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
  updateResponses       : PropTypes.func.isRequired,
  updateUserResponses   : PropTypes.func.isRequired,
  cookies               : PropTypes.instanceOf(Cookies).isRequired,
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
  updateResponses       : (responses) => dispatch(updateResponses(responses, props.params.identifier)),
  updateUserResponses   : (responses) => dispatch(updateUserResponses(responses, props.params.identifier))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(withCookies(Answer))

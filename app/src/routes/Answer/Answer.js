import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import Helmet from 'react-helmet'
import Linkify from 'react-linkify'
import Countdown from 'react-countdown-now'
import { browserHistory } from 'react-router'
import { pollSelector, hasQuestionSelector, totalResponsesSelector, userRespondedSelector } from 'store/poll'
import { answersSelector, clearAnswers } from 'store/answers'
import { fetchPoll, APIError } from 'store/api'
import { setLoading, setRequiresPassphrase, requiresPassphraseSelector } from 'store/loader'
import { hasUserSelector } from 'store/user'
import Back from 'components/Back'
import Sharing from './components/Sharing'
import Answers from './components/Answers'
import Passphrase from './components/Passphrase'
import './Answer.scss'

class Answer extends React.Component {
  componentWillMount = () => {
    const { hasPoll, setLoading, fetchPoll, clearAnswers, setRequiresPassphrase } = this.props

    if (!hasPoll) {
      setLoading(true)
    }
    clearAnswers()
    fetchPoll(this.props.identifier).then((response) => {
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

  endingToString = (days, hours, minutes, seconds) => {
    let endingString = ''

    endingString += days ? ` ${days} days and` : ''
    endingString += days || hours ? ` ${hours} hours ${!days ? 'and' : ''}` : ''
    endingString += !days && (hours || minutes) ? ` ${minutes} minutes ${!hours ? 'and' : ''}` : ''
    endingString += !days && !hours ? ` ${seconds} seconds` : ''

    return endingString
  }

  countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    let ending = ''

    if (completed) {
      ending = 'This poll has now ended'
    } else {
      ending = 'This poll will end in' + this.endingToString(days, hours, minutes, seconds)
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
  setRequiresPassphrase : PropTypes.func.isRequired
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

const mapDispatchToProps = (dispatch) => ({
  fetchPoll             : (identifier) => dispatch(fetchPoll(identifier)),
  clearAnswers          : () => dispatch(clearAnswers()),
  setLoading            : (value) => dispatch(setLoading(value)),
  setRequiresPassphrase : (value) => dispatch(setRequiresPassphrase(value))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Answer)

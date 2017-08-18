import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import Helmet from 'react-helmet'
import Linkify from 'react-linkify'
import { browserHistory } from 'react-router'
import { pollSelector, hasQuestionSelector, totalResponsesSelector, userRespondedSelector } from 'store/poll'
import { answersSelector } from 'store/answers'
import { fetchPoll, APIError } from 'store/api'
import { setLoading, setRequiresPassphrase, requiresPassphraseSelector } from 'store/loader'
import Back from 'components/Back'
import Sharing from './components/Sharing'
import Answers from './components/Answers'
import Passphrase from './components/Passphrase'
import './Answer.scss'

class Answer extends React.Component {
  componentWillMount = () => {
    if (!this.props.hasPoll) {
      this.props.setLoading(true)
    }
    this.props.fetchPoll(this.props.identifier).then((response) => {
      if (response instanceof APIError) {
        if (response.details.status === 401 && response.details.error.error === 'incorrect-passphrase') {
          this.props.setRequiresPassphrase(true)
          this.props.setLoading(false)
        } else {
          browserHistory.push('/404')
        }
      } else {
        this.props.setLoading(false)
      }
    })
  }

  render () {
    const { hasPoll, poll, requiresPassphrase, answers, totalResponses, userResponded } = this.props

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
              </div>
            </div>
            <Answers
              poll={poll}
              answers={answers}
              totalResponses={totalResponses}
              userResponded={userResponded} />
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
  fetchPoll             : PropTypes.func.isRequired,
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
  answers            : answersSelector(state, props.params.identifier),
  totalResponses     : totalResponsesSelector(state, props.params.identifier),
  userResponded      : userRespondedSelector(state, props.params.identifier)
})

const mapDispatchToProps = (dispatch) => ({
  fetchPoll             : (identifier) => dispatch(fetchPoll(identifier)),
  setLoading            : (value) => dispatch(setLoading(value)),
  setRequiresPassphrase : (value) => dispatch(setRequiresPassphrase(value))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Answer)

import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import { browserHistory } from 'react-router'
import { pollSelector, hasQuestionSelector } from 'store/poll'
import { fetchPoll, APIError } from 'store/api'
import { setLoading, setRequiresPassphrase, requiresPassphraseSelector } from 'store/loader'
import Sharing from './components/Sharing/Sharing'
import Back from 'components/Back/Back'
import Answers from './components/Answers/Answers'
import Passphrase from './components/Passphrase/Passphrase'
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
        } else {
          browserHistory.push('/404')
        }
      }
      this.props.setLoading(false)
    })
  }

  render = () => (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{ this.props.poll.question }</title>
        <meta name='description' content='Join in the vote and answer this poll at itsgoingto.be' />
        <meta name='keywords' content='question vote poll result' />
      </Helmet>
      { this.props.hasPoll &&
        <div>
          <Back />
          <div className='container header-container answer-header-container'>
            <div className='header center-text'>
              <h2>{ this.props.poll.question }</h2>
              <Sharing poll={this.props.poll} />
            </div>
          </div>
          <Answers />
        </div>
      }
      { this.props.requiresPassphrase &&
        <Passphrase />
      }
    </div>
  )
}

Answer.propTypes = {
  identifier            : PropTypes.string.isRequired,
  poll                  : PropTypes.object.isRequired,
  hasPoll               : PropTypes.bool.isRequired,
  requiresPassphrase    : PropTypes.bool.isRequired,
  fetchPoll             : PropTypes.func.isRequired,
  setLoading            : PropTypes.func.isRequired,
  setRequiresPassphrase : PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => ({
  poll               : pollSelector(state, props.params.identifier),
  hasPoll            : hasQuestionSelector(state, props.params.identifier),
  requiresPassphrase : requiresPassphraseSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPoll             : (identifier) => dispatch(fetchPoll(identifier)),
  setLoading            : (value) => dispatch(setLoading(value)),
  setRequiresPassphrase : (value) => dispatch(setRequiresPassphrase(value))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Answer)

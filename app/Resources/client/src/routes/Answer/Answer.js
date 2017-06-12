import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import { pollSelector, hasQuestionSelector } from '../../store/poll'
import { fetchPoll } from '../../store/api'
import { setLoading } from '../../store/loader'
import Sharing from './components/Sharing/Sharing'
import Back from './components/Back/Back'
import Answers from './components/Answers/Answers'
import './Answer.scss'

/**
 * TODO :
 *   Answers
 *   Auto link URLs
 */

class Answer extends React.Component {
  constructor (props) {
    super(props)
    if (!props.hasPoll) {
      props.setLoading(true)
    }
    props.fetchPoll(props.identifier).then(() => props.setLoading(false))
  }

  render = () => (
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
  )
}

Answer.propTypes = {
  identifier : PropTypes.string.isRequired,
  poll       : PropTypes.object.isRequired,
  hasPoll    : PropTypes.bool.isRequired,
  fetchPoll  : PropTypes.func.isRequired,
  setLoading : PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => ({
  poll    : pollSelector(state, props.params.identifier),
  hasPoll : hasQuestionSelector(state, props.params.identifier),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPoll  : (identifier) => dispatch(fetchPoll(identifier)),
  setLoading : (loading) => dispatch(setLoading(loading))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Answer)

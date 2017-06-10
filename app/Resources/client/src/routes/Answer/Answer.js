import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import { pollSelector } from '../../store/poll'
import { answersSelector } from '../../store/answers'
import { fetchPoll } from '../../store/api'
import Sharing from './components/Sharing/Sharing'
import './Answer.scss'

/**
 * TODO :
 *   Loading indicator / overlay before question loads
 *   Answers
 *   Stop fontawesome loading woff2
 */

class Answer extends React.Component {
  constructor (props) {
    super(props)
    props.fetchPoll(props.identifier)
  }
  render = () => (
    <div>
      <div className='container header-container answer-header-container'>
        <div className='header center-text'>
          <h2>{ this.props.poll.question }</h2>
          <Sharing poll={ this.props.poll } />
        </div>
      </div>
    </div>
  )
}

Answer.propTypes = {
  identifier : PropTypes.string.isRequired,
  poll       : PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => ({
  poll    : pollSelector(state, props.params.identifier),
  // TODO : Update answers to be objects and fetch by identifier
  answers : answersSelector(state, props.params.identifier)
})

const mapDispatchToProps = (dispatch) => ({
  fetchPoll : (identifier) => dispatch(fetchPoll(identifier))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Answer)

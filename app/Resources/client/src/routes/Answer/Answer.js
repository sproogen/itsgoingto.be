import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { mergeAll } from 'ramda'
import { questionSelector } from '../../store/poll'
import './Answer.scss'

export const Answer = ({ identifier, question }) => (
  <div>
    <h1>{ identifier } : { question }</h1>
  </div>
)

Answer.propTypes = {
  identifier : PropTypes.string.isRequired,
  question   : PropTypes.string.isRequired
}

const mapStateToProps = (state, props) => ({ question : questionSelector(state) })

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(mapStateToProps, null, mergeProps)(Answer)

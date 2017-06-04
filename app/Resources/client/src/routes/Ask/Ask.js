import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { hasQuestionSelector } from '../../store/question'
import WordRotate from '../../components/WordRotate/WordRotate'
import Question from '../../components/Question/Question'
import './Ask.scss'

export const Ask = ({ hasQuestion }) => {
  return (
    <div>
      <div className={'container header-container hideable' + (hasQuestion ? ' gone' : '')}>
        <div className='header center-text'>
          <h1><WordRotate words='What,Where,When,Who' /> is it going to be?</h1>
        </div>
      </div>
      <Question />
    </div>
  )
}

Ask.propTypes = {
  hasQuestion: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return{
    hasQuestion : hasQuestionSelector(state)
  }
}

export default connect(mapStateToProps)(Ask)

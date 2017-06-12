import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { hasQuestionSelector, updatePoll, initialPoll } from '../../store/poll'
import WordRotate from '../../components/WordRotate/WordRotate'
import Question from './components/Question/Question'
import './Ask.scss'

class Ask extends React.Component {
  constructor (props) {
    super(props)
    props.clearPoll()
  }

  render = () => (
    <div>
      <div className={'container header-container hideable' + (this.props.hasQuestion ? ' gone' : '')}>
        <div className='header center-text'>
          <h1><WordRotate words='What,Where,When,Who' /> is it going to be?</h1>
        </div>
      </div>
      <Question />
    </div>
  )
}

Ask.propTypes = {
  hasQuestion : PropTypes.bool.isRequired,
  clearPoll   : PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  hasQuestion : hasQuestionSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  clearPoll : () => dispatch(updatePoll(initialPoll))
})

export default connect(mapStateToProps, mapDispatchToProps)(Ask)

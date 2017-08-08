import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { hasQuestionSelector, updatePoll, initialPoll } from '../../store/poll'
import WordRotate from '../../components/WordRotate/WordRotate'
import Question from './components/Question/Question'
import './Ask.scss'

const WORDS = 'What,Where,When,Who'
const PLACEHOLDER_TEXT = [
  'What film should we watch?',
  'Who is going to win the league?',
  'Where should we go for drinks?',
  'You talking to me?',
  'What should we do this weekend?',
  'When should we go to Paris?',
  'Who ya gonna call?',
  'When will you start a poll?'
]

class Ask extends React.Component {
  constructor (props) {
    super(props)
    props.clearPoll()
  }

  render = () => (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>It&#39;s Going To Be</title>
        <meta
          name='description'
          content='Wondering where to go or what to see? Start a vote and share it with your friends or colleagues.' />
        <meta name='keywords' content='question vote poll result' />
      </Helmet>
      <div className={'container header-container hideable' + (this.props.hasQuestion ? ' gone' : '')}>
        <div className='header center-text'>
          <h1><WordRotate words={WORDS} /> is it going to be?</h1>
        </div>
      </div>
      <Question placeholderText={PLACEHOLDER_TEXT} />
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

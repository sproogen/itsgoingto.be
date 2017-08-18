import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { questionSelector, hasQuestionSelector, updatePoll, initialPoll, pollSelector } from 'store/poll'
import { canSubmitPollSelector, answersSelector } from 'store/answers'
import WordRotate from 'components/WordRotate'
import Question from './components/Question'
import Answers from './components/Answers'
import Actions from './components/Actions'
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

  render () {
    const { question, hasQuestion, canSubmitPoll, poll, answers } = this.props
    let description = 'Wondering where to go or what to see?' +
                      ' Start a vote and share it with your friends or colleagues.'

    return (
      <div>
        <Helmet>
          <meta charSet='utf-8' />
          <title>It&#39;s Going To Be</title>
          <meta
            name='description'
            content={description} />
          <meta name='keywords' content='question vote poll result' />
        </Helmet>
        <div className={'container header-container hideable' + (hasQuestion ? ' gone' : '')}>
          <div className='header center-text'>
            <h1><WordRotate words={WORDS} /> is it going to be?</h1>
          </div>
        </div>
        <div className={'container question-container' + (hasQuestion ? ' move-up' : '')}>
          <Question
            question={question}
            hasQuestion={hasQuestion}
            canSubmitPoll={canSubmitPoll}
            placeholderText={PLACEHOLDER_TEXT} />
          <Answers hasQuestion={hasQuestion} answers={answers} />
          <Actions hasQuestion={hasQuestion} canSubmitPoll={canSubmitPoll} poll={poll} />
        </div>
      </div>
    )
  }
}

Ask.propTypes = {
  question      : PropTypes.object.isRequired,
  hasQuestion   : PropTypes.bool.isRequired,
  canSubmitPoll : PropTypes.bool.isRequired,
  poll          : PropTypes.object.isRequired,
  answers       : PropTypes.array.isRequired,
  clearPoll     : PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  question      : questionSelector(state),
  hasQuestion   : hasQuestionSelector(state),
  canSubmitPoll : canSubmitPollSelector(state),
  poll          : pollSelector(state),
  answers       : answersSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  clearPoll : () => dispatch(updatePoll(initialPoll))
})

export default connect(mapStateToProps, mapDispatchToProps)(Ask)

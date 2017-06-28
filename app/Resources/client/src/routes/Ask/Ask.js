import React from 'react'
import {Helmet} from "react-helmet";
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { hasQuestionSelector, updatePoll, initialPoll } from '../../store/poll'
import WordRotate from '../../components/WordRotate/WordRotate'
import Question from './components/Question/Question'
import ItsGoingToBeLogo from './assets/itsgoingtobe-logo.png'
import './Ask.scss'

class Ask extends React.Component {
  constructor (props) {
    super(props)
    props.clearPoll()
  }

  render = () => (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>It&#39;s Going To Be</title>

        <meta name="description" content="Wondering where to go or what to see? Start a vote and share it with your friends or colleagues." />
        <meta name="keywords" content="question vote poll result" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@sproogen" />
        <meta name="twitter:title" content="It&#39;s Going To Be" />
        <meta name="twitter:description" content="Wondering where to go or what to see? Start a vote and share it with your friends or colleagues." />
        <meta name="twitter:image" content={ItsGoingToBeLogo} />
      </Helmet>
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

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import autosize from 'autosize'
import EventBus from '../EventBus'
import { questionSelector, hasQuestionSelector, updateQuestion } from '../../store/question'
import Answers from '../Answers/Answers'
import Actions from '../Actions/Actions'
import './Question.scss'

const KEY_DOWN_ARROW = 40
const KEY_ENTER = 13

class Question extends React.Component {
  handleChange = (event) => {
    this.props.onQuestionChange(event.target.value)
  }

  handleKeyPress = (event) => {
    event = event || window.event;
    const key = event.keyCode || event.charCode

    switch(key) {
      case KEY_DOWN_ARROW:
      case KEY_ENTER:
        event.preventDefault()
        this.eventBus.emit('focus', 0)
        break
    }
  }

  componentDidMount = () => {
    this.eventBus = EventBus.getEventBus()
    this.eventListener = this.eventBus.addListener('focus', (index) => {
      if (index === -1) {
        this.refs.question.focus()
      }
    })
    autosize(this.refs.question)
  }

  componentWillUnmount = () => {
    this.eventListener.remove()
    autosize.destroy(this.refs.question)
  }

  render = () => (
    <div className={'container question-container' + (this.props.hasQuestion ? ' move-up' : '')}>
      <div className='input input-question'>
        <label className='input-label input-label-question' htmlFor='question'>Ask a question</label>
        <textarea
          className='input-field input-field-question js-auto-size'
          value={this.props.question}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          rows='1'
          id='question'
          name='question'
          ref='question' />
      </div>
      <Answers />
      <Actions />
    </div>
  )
}

Question.propTypes = {
  question         : PropTypes.string.isRequired,
  hasQuestion      : PropTypes.bool.isRequired,
  onQuestionChange : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  onQuestionChange : (value) => dispatch(updateQuestion(value))
})

const mapStateToProps = (state) => ({
  question    : questionSelector(state),
  hasQuestion : hasQuestionSelector(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Question)

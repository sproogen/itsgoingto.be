import React from 'react'
import PropTypes from 'prop-types'
import { merge } from 'ramda'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Linkify from 'react-linkify'
import './Answer.scss'

export class Answer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { animating : false }
    this.linkClicked = false
  }

  handleClick = () => {
    const { answer, poll, postResponse } = this.props

    if (!this.linkClicked) {
      this.setState((prevState) =>
        merge(prevState, { animating : true })
      )
      setTimeout(() => {
        this.setState((prevState) =>
          merge(prevState, { animating : false })
        )
      }, 550)
      if (!poll.ended) {
        postResponse(answer.id)
      }
    } else {
      this.linkClicked = false
    }
  }

  linkClick = () => {
    this.linkClicked = true
  }

  calculateWidth = () =>
    (this.props.answer.responsesCount / this.props.totalResponses) * 100 + '%'

  render () {
    const { index, type, checked, answer } = this.props
    const { animating } = this.state
    const width = this.calculateWidth()

    return (
      <span className='input input-options'>
        <span className='result-wrapper'>
          <span className='result' name={'answer-' + index} style={{ width }} />
        </span>
        <input
          id={'answer-' + index}
          name='answer'
          className={type === 'radio'
                      ? 'input-radio input-radio-options'
                      : 'input-checkbox input-checkbox-options'}
          type={type}
          value={index}
          checked={checked}
          readOnly />
        <label
          htmlFor={'answer-' + index}
          className={'input-label input-label-options' + (animating ? ' input-label-options--click' : '')}
          onClick={this.handleClick}>
          <Linkify properties={{ target: '_blank', onClick: this.linkClick }}>{ answer.answer }</Linkify>
        </label>
        <span htmlFor={'answer-' + index} className='input-label-votes'>
          {answer.responsesCount} votes
        </span>
      </span>
    )
  }
}

Answer.propTypes = {
  index          : PropTypes.number.isRequired,
  type           : PropTypes.string.isRequired,
  answer         : PropTypes.object.isRequired,
  poll           : PropTypes.object.isRequired,
  totalResponses : PropTypes.number.isRequired,
  checked        : PropTypes.bool.isRequired,
  postResponse   : PropTypes.func.isRequired
}

export default Answer

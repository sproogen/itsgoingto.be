import React from 'react'
import PropTypes from 'prop-types'
import './Answer.scss'

// TODO : Clicky anomation on checkbox

export class Answer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { animating: false }
  }

  handleClick = () => {
    this.setState({ animating: true })
    setTimeout(() => { this.setState({ animating: false }) }, 550)
  }

  render = () => (
    <span className='input input-options'>
      <span className='result-wrapper'>
        <span className='result' name='answer-435' />
      </span>
      <input
        id={'answer-' + this.props.index}
        name='answer'
        className='input-radio input-radio-options'
        type='radio'
        value={this.props.index} />
      <label
        htmlFor={'answer-' + this.props.index}
        className={'input-label input-label-options' + (this.state.animating ? ' input-label-options--click' : '')}
        onClick={this.handleClick}>
        { this.props.text }
      </label>
      <span htmlFor={'answer-' + this.props.index} className='input-label-votes'>0 votes</span>
    </span>
  )
}

Answer.propTypes = {
  index : PropTypes.number.isRequired,
  text  : PropTypes.string.isRequired
}

export default Answer

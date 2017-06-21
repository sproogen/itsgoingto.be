import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { mergeAll } from 'ramda'
import { postResponse } from 'store/api'
import { userRespondedAnswerSelector } from 'store/poll'
import './Answer.scss'

export class Answer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { animating: false }
  }

  handleClick = () => {
    this.setState({ animating: true })
    setTimeout(() => { this.setState({ animating: false }) }, 550)
    this.props.postResponse()
  }

  calculateWidth = () => {
    return (this.props.answer.responsesCount/this.props.totalResponses) * 100 + '%'
  }

  render = () => (
    <span className='input input-options'>
      <span className='result-wrapper'>
        <span className='result' name={'answer-' + this.props.index} style={{width: this.calculateWidth()}} />
      </span>
      <input
        id={'answer-' + this.props.index}
        name='answer'
        className='input-radio input-radio-options'
        type='radio'
        value={this.props.index}
        checked={this.props.checked} />
      <label
        htmlFor={'answer-' + this.props.index}
        className={'input-label input-label-options' + (this.state.animating ? ' input-label-options--click' : '')}
        onClick={this.handleClick}>
        { this.props.answer.answer }
      </label>
      <span htmlFor={'answer-' + this.props.index} className='input-label-votes'>{this.props.answer.responsesCount} votes</span>
    </span>
  )
}

Answer.propTypes = {
  index          : PropTypes.number.isRequired,
  answer         : PropTypes.object.isRequired,
  totalResponses : PropTypes.number.isRequired,
  checked        : PropTypes.bool.isRequired,
  postResponse   : PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => ({
  checked : userRespondedAnswerSelector(state, props.params.identifier, props.answer.id)
})

const mapDispatchToProps = (dispatch, props) => ({
  postResponse : () => dispatch(postResponse(props.answer.id, props.params.identifier))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Answer))

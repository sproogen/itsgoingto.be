import React from 'react'
import WordRotate from '../../../components/WordRotate/WordRotate'
import { compose, not, equals, length } from 'ramda'
import './AskView.scss'

class AskView extends React.Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = { question: '' }
  }

  hasQuestion = () => compose(not, equals(0), length)(this.state.question)

  handleChange = (event) => {
    this.setState({question: event.target.value})
  }

  componentDidMount = () => {
    this.refs.props
  }

  render = () => (
    <div>
      <div className={'container header-container hideable' + (this.hasQuestion() ? ' gone' : '')}>
        <div className='header center-text'>
          <h1><WordRotate words='What,Where,When,Who' /> is it going to be?</h1>
        </div>
      </div>
      <div className={'container question-container' + (this.hasQuestion() ? ' move-up' : '')}>
        <div className='input input-question'>
          <label className='input-label input-label-question' htmlFor='question'>Ask a question</label>
          <textarea
            className='input-field input-field-question js-auto-size'
            value={this.state.question}
            onChange={this.handleChange}
            rows='1'
            id='question'
            name='question'
            ref='question' />
        </div>
        <div className={"answers hideable" + (this.hasQuestion() ? '' : ' gone-off')}>
          <div className="input input-answer">
            <label className='input-label input-label-answer' htmlFor='answer-1'>1</label>
            <input className="input-field input-field-answer" type="text" id="answer-1" name="answer-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskView

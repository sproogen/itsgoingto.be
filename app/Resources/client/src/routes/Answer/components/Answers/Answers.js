import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { answersSelector } from 'store/answers'
import Answer from '../Answer/Answer'
import './Answers.scss'

class Answers extends React.Component {
  render = () => (
    <div className='container answer-container'>
      <div className='options'>
        {this.props.answers.map((answer, index) =>
          <Answer key={index} index={index} text={answer.answer} id={answer.id} />
        )}
      </div>
    </div>
  )
}

Answers.propTypes = {
  answers : PropTypes.array.isRequired,
}

const mapStateToProps = (state, props) => ({
  answers : answersSelector(state, props.identifier),
})

export default connect(mapStateToProps)(Answers)

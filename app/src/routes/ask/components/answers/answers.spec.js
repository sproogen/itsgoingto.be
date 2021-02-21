import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import Answers from './answers'

const defaultProps = {
  hasQuestion: true,
  answers: [],
  onAnswerChange: jest.fn(),
  onRemoveAnswer: jest.fn()
}

describe('(Route) Ask', () => {
  describe('(Component) Answers', () => {
    describe('(Render)', () => {
      describe('when hasQuestion is true', () => {
        it('answers does not have class gone', () => {
          render(<Answers {...defaultProps} hasQuestion />)

          const options = screen.getByTestId('answers')
          expect(options).not.toHaveClass('gone')
        })
      })

      describe('when hasQuestion is false', () => {
        it('answers has class gone', () => {
          render(<Answers {...defaultProps} hasQuestion={false} />)

          const options = screen.getByTestId('answers')
          expect(options).toHaveClass('gone')
        })
      })

      describe('with answers as strings', () => {
        it('matches snapshot', () => {
          const answers = [
            'Answer 1',
            'Answer 2',
            'Answer 3'
          ]
          const { asFragment } = render(<Answers {...defaultProps} answers={answers} />)

          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('with answers as objects', () => {
        it('matches snapshot', () => {
          const answers = [
            { id: 4, answer: 'Answer 4' },
            { id: 5, answer: 'Answer 5' },
            { id: 6, answer: 'Answer 6' }
          ]
          const { asFragment } = render(<Answers {...defaultProps} answers={answers} />)

          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})

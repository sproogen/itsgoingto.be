import React from 'react'
import { render } from '@testing-library/react'
import Answers from './answers'

const defaultProps = {
  answers: [],
  onAnswerChange: jest.fn(),
  onRemoveAnswer: jest.fn()
}

describe('(Route) Ask', () => {
  describe('(Component) Answers', () => {
    describe('(Render)', () => {
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

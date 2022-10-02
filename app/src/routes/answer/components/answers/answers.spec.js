import React from 'react'
import {
  render, screen,
} from '@testing-library/react'
import Answers from './answers'

jest.mock('components/spinner', () => () => <div>Mocked SpinnerComponent</div>)
jest.mock('../answer', () => ({ type, viewOnly, checked }) => <div>Mocked AnswerComponent ({type}/{viewOnly && 'viewOnly'}/{checked && 'checked'})</div>) // eslint-disable-line

const defaultProps = {
  answers: [{ id: 1, answer: 'A', responseCount: 0 }, { id: 2, answer: 'B', responseCount: 0 }],
  poll: {
    ended: false,
    multipleChoice: false,
  },
  userResponded: false,
  viewOnly: false,
  onResponseSelected: () => { /* Do nothing */ },
}

describe('(Route) answer', () => {
  describe('(Component) answers', () => {
    describe('(Render)', () => {
      describe('has no answers', () => {
        it('renders spinner component', () => {
          render(<Answers {...defaultProps} answers={[]} />)
          expect(screen.getByText('Mocked SpinnerComponent')).toBeInTheDocument()
        })
      })

      describe('has answers', () => {
        it('renders answers', () => {
          render(<Answers {...defaultProps} />)
          expect(screen.getAllByText(/Mocked AnswerComponent/)).toHaveLength(2)
          expect(screen.getAllByText(/radio/)).toHaveLength(2)
        })
      })

      describe('Poll is multiple choice', () => {
        it('answer type is checkbox', () => {
          render(
            <Answers
              {...defaultProps}
              poll={{
                ended: false,
                multipleChoice: true,
              }}
            />,
          )
          expect(screen.getAllByText(/Mocked AnswerComponent/)).toHaveLength(2)
          expect(screen.getAllByText(/checkbox/)).toHaveLength(2)
        })
      })

      describe('User has responded to answer', () => {
        it('renders checked answer', () => {
          render(
            <Answers
              {...defaultProps}
              userResponded
              poll={{
                ended: false,
                multipleChoice: false,
                userResponses: [1],
              }}
            />,
          )
          expect(screen.getAllByText(/Mocked AnswerComponent/)).toHaveLength(2)
          expect(screen.getAllByText(/checked/)).toHaveLength(1) // eslint-disable-line
        })
      })

      describe('is view only', () => {
        it('renders answers with viewOnly', () => {
          render(<Answers {...defaultProps} viewOnly />)
          expect(screen.getAllByText(/Mocked AnswerComponent/)).toHaveLength(2)
          expect(screen.getAllByText(/viewOnly/)).toHaveLength(2)
        })
      })
    })
  })
})

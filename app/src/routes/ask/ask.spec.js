import React from 'react'
import { render } from '@testing-library/react'
import WithRouter from '../../../test-utils/with-router'
import Ask from './ask'

const props = {
  question: '',
  hasQuestion: false,
  canSubmitPoll: false,
  poll: {},
  answers: [],
  clearPoll: jest.fn(),
  postPoll: jest.fn(),
  updateQuestion: jest.fn(),
  onAnswerChange: jest.fn(),
  onRemoveAnswer: jest.fn(),
  updateOptions: jest.fn(),
}

describe('(Route) Ask', () => {
  describe('(Action) componentDidMount', () => {
    it('should call prop clearPoll', () => {
      render(<Ask {...props} />, {
        wrapper: WithRouter
      })

      expect(props.clearPoll).toHaveBeenCalled()
    })
  })

  describe('(Render)', () => {
    describe('with question', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} question="Some question" />, {
          wrapper: WithRouter
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when hasQuestion is true', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} hasQuestion />, {
          wrapper: WithRouter
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when canSubmitPoll is true', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} canSubmitPoll />, {
          wrapper: WithRouter
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('with poll', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} poll={{ question: 'Question', identifier: 'kdH98eJ' }} />, {
          wrapper: WithRouter
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('with answers', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} answers={['Answer 1', 'Answer 2']} />, {
          wrapper: WithRouter
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

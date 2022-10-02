import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import WithRouter from '../../../test-utils/with-router'
import Ask from './ask'

const mockHistory = {
  push: jest.fn(),
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => mockHistory,
}));

const props = {
  question: '',
  hasQuestion: false,
  canSubmitPoll: false,
  poll: {},
  answers: [],
  clearPoll: jest.fn(),
  postPoll: jest.fn(() => Promise.resolve({ identifier: 'jdH93HS' })),
  updateQuestion: () => { /* Do nothing */ },
  onAnswerChange: () => { /* Do nothing */ },
  onRemoveAnswer: () => { /* Do nothing */ },
  updateOptions: () => { /* Do nothing */ },
  setPassphrase: jest.fn(),
}

describe('(Route) Ask', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('(Action) component mounted', () => {
    it('should call prop clearPoll', () => {
      render(<Ask {...props} />, {
        wrapper: WithRouter,
      })

      expect(props.clearPoll).toHaveBeenCalled()
    })
  })

  // TODO: Test set password before redirect
  describe('(Action) user submit poll', () => {
    describe('on successful postPoll', () => {
      it('should redirect with poll identifier', async () => {
        render(<Ask {...props} hasQuestion question="question" canSubmitPoll />, {
          wrapper: WithRouter,
        })

        const button = screen.getByTestId('button-Create-Poll')
        await fireEvent.click(button)
        expect(mockHistory.push).toBeCalledWith('/jdH93HS')
      })

      it('should call setPassphrase', async () => {
        render(<Ask {...props} poll={{ passphrase: 'pass123' }} hasQuestion question="question" canSubmitPoll />, {
          wrapper: WithRouter,
        })

        const button = screen.getByTestId('button-Create-Poll')
        await fireEvent.click(button)
        expect(props.setPassphrase).toBeCalledWith('pass123', 'jdH93HS')
      })
    })

    describe('on failed postPoll', () => {
      it('should not redirect', async () => {
        render((<Ask
          {...props}
          postPoll={jest.fn(() => Promise.resolve(false))}
          hasQuestion
          question="question"
          canSubmitPoll
        />), {
          wrapper: WithRouter,
        })

        const button = screen.getByTestId('button-Create-Poll')
        await fireEvent.click(button)
        expect(mockHistory.push).not.toBeCalled()
      })
    })
  })

  describe('(Render)', () => {
    describe('with question', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} question="Some question" />, {
          wrapper: WithRouter,
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when hasQuestion is true', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} question="Some question" hasQuestion />, {
          wrapper: WithRouter,
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when canSubmitPoll is true', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} canSubmitPoll />, {
          wrapper: WithRouter,
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('with poll', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} poll={{ question: 'Question', identifier: 'kdH98eJ' }} />, {
          wrapper: WithRouter,
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('with answers', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Ask {...props} answers={['Answer 1', 'Answer 2']} />, {
          wrapper: WithRouter,
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

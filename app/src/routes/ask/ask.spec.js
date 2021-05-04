import React from 'react'
import { render } from '@testing-library/react'
import WithRouter from '../../../test-utils/with-router'
import Ask from './ask'

// const mockHistory = {
//   push: jest.fn()
// }

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useHistory: () => mockHistory,
// }));

const props = {
  question: '',
  hasQuestion: false,
  canSubmitPoll: false,
  poll: {},
  answers: [],
  clearPoll: jest.fn(),
  postPoll: jest.fn(() => Promise.resolve({ identifier: 'jdH93HS' })),
  updateQuestion: jest.fn(),
  onAnswerChange: jest.fn(),
  onRemoveAnswer: jest.fn(),
  updateOptions: jest.fn(),
}

describe('(Route) Ask', () => {
  describe('(Action) component mounted', () => {
    it('should call prop clearPoll', () => {
      render(<Ask {...props} />, {
        wrapper: WithRouter
      })

      expect(props.clearPoll).toHaveBeenCalled()
    })
  })

  // TODO: Test set password before redirect
  // describe('(Action) user submit poll', () => {
  // it('should redirect with poll identifier on successful postPoll and return false', async () => {
  //   render(<Actions {...props} />, {
  //     wrapper: WithRouter
  //   })

  //   const button = screen.getByTestId('button-Create-Poll')
  //   await fireEvent.click(button)
  //   expect(mockHistory.push).toBeCalledWith('/jdH93HS')
  // })

  // it('should not redirect failed postPoll and return true', async () => {
  //   render(<Actions {...props} postPoll={jest.fn(() => Promise.resolve(false))} />, {
  //     wrapper: WithRouter
  //   })

  //   const button = screen.getByTestId('button-Create-Poll')
  //   await fireEvent.click(button)
  //   expect(mockHistory.push).not.toBeCalled()
  // })

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

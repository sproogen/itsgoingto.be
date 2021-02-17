import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import WithRouter from '../../../../../test-utils/with-router'
import Actions from './actions'

const mockHistory = {
  push: jest.fn()
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => mockHistory,
}));

const props = {
  hasQuestion: true,
  canSubmitPoll: true,
  postPoll: jest.fn(() => Promise.resolve({ identifier: 'jdH93HS' }))
}

describe('(Route) Ask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) Actions', () => {
    describe('(Action) Create Poll click', () => {
      it('should call postPoll', () => {
        render(<Actions {...props} />, {
          wrapper: WithRouter
        })

        const button = screen.getByTestId('button-Create-Poll')
        fireEvent.click(button)
        expect(props.postPoll).toBeCalled()
      })

      it('should redirect with poll identifier on successful postPoll and return false', async () => {
        render(<Actions {...props} />, {
          wrapper: WithRouter
        })

        const button = screen.getByTestId('button-Create-Poll')
        await fireEvent.click(button)
        expect(mockHistory.push).toBeCalledWith('/jdH93HS')
      })

      it('should not redirect failed postPoll and return true', async () => {
        render(<Actions {...props} postPoll={jest.fn(() => Promise.resolve(false))} />, {
          wrapper: WithRouter
        })

        const button = screen.getByTestId('button-Create-Poll')
        await fireEvent.click(button)
        expect(mockHistory.push).not.toBeCalled()
      })
    })

    describe('(Render)', () => {
      describe('when hasQuestion is true', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Actions {...props} hasQuestion />)
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when hasQuestion is false', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Actions {...props} hasQuestion={false} />)
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when canSubmitPoll is true', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Actions {...props} canSubmitPoll />)
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when canSubmitPoll is false', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Actions {...props} canSubmitPoll={false} />)
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})

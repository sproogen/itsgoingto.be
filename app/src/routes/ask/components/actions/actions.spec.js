import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import WithRouter from '../../../../../test-utils/with-router'
import Actions from './actions'

const props = {
  canSubmitPoll: true,
  submitPoll: jest.fn(() => Promise.resolve({ identifier: 'jdH93HS' })),
}

describe('(Route) Ask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) Actions', () => {
    describe('(Action) Create Poll click', () => {
      it('should call submitPoll', () => {
        render(<Actions {...props} />, {
          wrapper: WithRouter
        })

        const button = screen.getByTestId('button-Create-Poll')
        fireEvent.click(button)
        expect(props.submitPoll).toBeCalled()
      })
    })

    describe('(Render)', () => {
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

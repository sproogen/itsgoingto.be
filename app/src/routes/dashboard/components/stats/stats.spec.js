import React from 'react'
import { render } from '@testing-library/react'
import Stats from './stats'

const defaultProps = {
  fetchStats: jest.fn(),
}

describe('(Route) dashoard', () => {
  describe('(Component) stats', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Lifecycle) componentDidMount', () => {
      it('should call fetchStats', () => {
        render(<Stats {...defaultProps} />)

        expect(defaultProps.fetchStats).toHaveBeenCalledTimes(1)
      })
    })

    describe('(Render)', () => {
      describe('with no stats', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Stats {...defaultProps} />)

          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('with stats', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Stats {...defaultProps} polls={15} responses={39} />)

          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})

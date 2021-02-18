import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import Dashboard from './dashboard'

jest.mock('./components/stats', () => () => <div>Mocked Stats</div>)
jest.mock('./components/poll-table', () => () => <div>Mocked PollTable</div>)

const mockHistory = {
  push: jest.fn()
}
jest.mock('react-router-dom', () => ({
  useHistory: () => mockHistory
}))

const defaultProps = {
  hasUser: true,
  setLoading: jest.fn(),
}

describe('(Route) Login', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Lifecycle) component did load', () => {
    describe('hasUser false', () => {
      it('should call setLoading true', () => {
        render(<Dashboard {...defaultProps} hasUser={false} />)

        expect(defaultProps.setLoading).toHaveBeenCalledTimes(1)
        expect(defaultProps.setLoading).toHaveBeenCalledWith(true)
      })

      it('should redirect to /login', () => {
        render(<Dashboard {...defaultProps} hasUser={false} />)

        expect(mockHistory.push).toHaveBeenCalledTimes(1)
        expect(mockHistory.push).toHaveBeenCalledWith('/login')
      })
    })

    describe('hasUser true', () => {
      it('should call setLoading false', () => {
        render(<Dashboard {...defaultProps} hasUser />)

        expect(defaultProps.setLoading).toHaveBeenCalledTimes(1)
        expect(defaultProps.setLoading).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('(Lifecycle) hasUser prop changed', () => {
    describe('hasUser changes to false', () => {
      it('should call setLoading true', () => {
        const { rerender } = render(<Dashboard {...defaultProps} hasUser />)
        jest.clearAllMocks()
        rerender(<Dashboard {...defaultProps} hasUser={false} />)

        expect(defaultProps.setLoading).toHaveBeenCalledTimes(1)
        expect(defaultProps.setLoading).toHaveBeenCalledWith(true)
      })

      it('should redirect to /login', () => {
        const { rerender } = render(<Dashboard {...defaultProps} hasUser />)
        jest.clearAllMocks()
        rerender(<Dashboard {...defaultProps} hasUser={false} />)

        expect(mockHistory.push).toHaveBeenCalledTimes(1)
        expect(mockHistory.push).toHaveBeenCalledWith('/login')
      })
    })

    describe('hasUser true', () => {
      it('should call setLoading false', () => {
        const { rerender } = render(<Dashboard {...defaultProps} hasUser={false} />)
        jest.clearAllMocks()
        rerender(<Dashboard {...defaultProps} hasUser />)

        expect(defaultProps.setLoading).toHaveBeenCalledTimes(1)
        expect(defaultProps.setLoading).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('(Render)', () => {
    describe('hasUser false', () => {
      it('deos not show any components', () => {
        render(<Dashboard {...defaultProps} hasUser={false} />)

        expect(screen.queryByText('Mocked Stats')).not.toBeInTheDocument()
        expect(screen.queryByText('Mocked PollTable')).not.toBeInTheDocument()
      })
    })

    describe('hasUser true', () => {
      it('shows stats and poll table components', () => {
        render(<Dashboard {...defaultProps} hasUser />)
        expect(screen.getByText('Mocked Stats')).toBeInTheDocument()
        expect(screen.getByText('Mocked PollTable')).toBeInTheDocument()
      })
    })
  })
})

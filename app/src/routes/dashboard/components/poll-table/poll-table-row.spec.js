import React from 'react'
import {
  render, fireEvent, screen,
} from '@testing-library/react'
import PollTableRow from './poll-table-row'

const mockHistory = {
  push: jest.fn(),
}
jest.mock('react-router-dom', () => ({
  useHistory: () => mockHistory,
}))

const defaultProps = {
  poll: {
    id: 1,
    identifier: 'sk93jn28d',
    question: 'This is a question',
    responsesCount: 5,
    deleted: false,
    ended: false,
    created: '2021-02-17T17:02:36.839Z',
  },
  deletePoll: jest.fn(),
}

const TableWrapper = ({ children }) => <table><tbody>{children}</tbody></table> // eslint-disable-line

describe('(Route) dashboard', () => {
  describe('(Component) poll table row', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) identifier onClick', () => {
      it('should route to identifier', () => {
        render(<PollTableRow {...defaultProps} />, { wrapper: TableWrapper })

        fireEvent.click(screen.getByRole('button', { name: /sk93jn28d/ }))

        expect(mockHistory.push).toHaveBeenCalledTimes(1)
        expect(mockHistory.push).toHaveBeenCalledWith('/sk93jn28d')
      })
    })

    describe('(Action) delete onClick', () => {
      it('should change to delete state', async () => {
        render(<PollTableRow {...defaultProps} />, { wrapper: TableWrapper })

        fireEvent.click(screen.getByTestId('delete-1'))

        expect(screen.queryByTestId('delete-1')).not.toBeInTheDocument()
        expect(screen.getByTestId('delete-1-spinner')).toBeInTheDocument()
      })

      it('should call deletePoll with poll identifier', () => {
        render(<PollTableRow {...defaultProps} />, { wrapper: TableWrapper })

        fireEvent.click(screen.getByTestId('delete-1'))

        expect(defaultProps.deletePoll).toHaveBeenCalledTimes(1)
        expect(defaultProps.deletePoll).toHaveBeenCalledWith('sk93jn28d')
      })
    })

    describe('(Render)', () => {
      describe('default props', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<PollTableRow {...defaultProps} />, { wrapper: TableWrapper })
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('poll is active', () => {
        it('shows active status', () => {
          render(
            <PollTableRow
              {...defaultProps}
              poll={{ ...defaultProps.poll, ended: false, deleted: false }}
            />, { wrapper: TableWrapper },
          )

          expect(screen.getByTestId('status-1')).toHaveTextContent('Active')
        })
      })

      describe('poll is ended', () => {
        it('shows ended status', () => {
          render(
            <PollTableRow
              {...defaultProps}
              poll={{ ...defaultProps.poll, ended: true }}
            />, { wrapper: TableWrapper },
          )

          expect(screen.getByTestId('status-1')).toHaveTextContent('Ended')
        })
      })

      describe('poll is deleted', () => {
        it('shows deleted status', () => {
          render(
            <PollTableRow
              {...defaultProps}
              poll={{ ...defaultProps.poll, deleted: true }}
            />, { wrapper: TableWrapper },
          )

          expect(screen.getByTestId('status-1')).toHaveTextContent('Deleted')
        })
      })
    })
  })
})

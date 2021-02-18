import React from 'react'
import {
  render, fireEvent, screen, waitForElementToBeRemoved, act
} from '@testing-library/react'
import { map } from 'ramda'
import PollTable from './poll-table'

jest.mock('./poll-table-row', () => () => <tr><td>Mocked PollTableRow</td></tr>)
jest.mock('components/paginator', () => () => <div>Mocked Paginator</div>)

const defaultProps = {
  polls: map((id) => ({ id }), [...Array(10).keys()]),
  pollCount: 30,
  page: 0,
  fetchPolls: jest.fn(() => Promise.resolve()),
  setPollPage: jest.fn(),
  deletePoll: jest.fn(),
}

describe('(Route) dashboard', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) poll table', () => {
    describe('(Lifecycle) fetchPolls useEffect', () => {
      let fetchPollsCallbackResolve
      const fetchPollsCallback = new Promise((resolve) => {
        fetchPollsCallbackResolve = resolve
      })
      const fetchPolls = jest.fn(() => fetchPollsCallback)

      const fetchesPollsForPage = async (page, sort, sortDirection) => {
        // Loading spinner is visible
        expect(screen.queryByTestId('spinner-container')).toBeInTheDocument()

        // Table container has class hidden
        expect(screen.getByTestId('table-container')).toHaveClass('hidden')

        // TODO: Test cancels fetchPolls already in progress

        // Makes call to fetchPolls
        expect(fetchPolls).toHaveBeenCalledWith(page + 1, sort, sortDirection)

        fetchPollsCallbackResolve()

        // Loading spinner is not visible once call resolves
        await waitForElementToBeRemoved(() => screen.queryByTestId('spinner-container'))

        // Table container doesn't have class hidden
        expect(screen.getByTestId('table-container')).not.toHaveClass('hidden')
      }

      describe('on initial load', () => {
        it('fetch polls for page', async () => { // eslint-disable-line
          render(<PollTable {...defaultProps} fetchPolls={fetchPolls} />)

          await fetchesPollsForPage(0, 'id', 'desc')
        })
      })

      describe('on page prop change', () => {
        it('fetch polls for page', async () => { // eslint-disable-line
          const { rerender } = render(<PollTable {...defaultProps} fetchPolls={fetchPolls} />)
          fetchPollsCallbackResolve()
          rerender(<PollTable {...defaultProps} fetchPolls={fetchPolls} page={1} />)

          await fetchesPollsForPage(1, 'id', 'desc')
        })
      })

      describe('(Action) on sort by id', () => {
        it('fetch polls for page', async () => { // eslint-disable-line
          render(<PollTable {...defaultProps} fetchPolls={fetchPolls} />)
          fetchPollsCallbackResolve()

          fireEvent.click(screen.getByRole('button', { name: /ID/ }))
          await fetchesPollsForPage(0, 'id', 'desc')

          fireEvent.click(screen.getByRole('button', { name: /ID/ }))
          await fetchesPollsForPage(0, 'id', 'asc')
        })
      })

      describe('(Action) on sort by identifier', () => {
        it('fetch polls for page', async () => { // eslint-disable-line
          render(<PollTable {...defaultProps} fetchPolls={fetchPolls} />)
          fetchPollsCallbackResolve()

          fireEvent.click(screen.getByRole('button', { name: /Identifier/ }))
          await fetchesPollsForPage(0, 'identifier', 'asc')

          fireEvent.click(screen.getByRole('button', { name: /Identifier/ }))
          await fetchesPollsForPage(0, 'identifier', 'desc')
        })
      })

      describe('(Action) on sort by question', () => {
        it('fetch polls for page', async () => { // eslint-disable-line
          render(<PollTable {...defaultProps} fetchPolls={fetchPolls} />)
          fetchPollsCallbackResolve()

          fireEvent.click(screen.getByRole('button', { name: /Question/ }))
          await fetchesPollsForPage(0, 'question', 'asc')

          fireEvent.click(screen.getByRole('button', { name: /Question/ }))
          await fetchesPollsForPage(0, 'question', 'desc')
        })
      })

      describe('(Action) on sort by created', () => {
        it('fetch polls for page', async () => { // eslint-disable-line
          render(<PollTable {...defaultProps} fetchPolls={fetchPolls} />)
          fetchPollsCallbackResolve()

          fireEvent.click(screen.getByRole('button', { name: /Created At/ }))
          await fetchesPollsForPage(0, 'created', 'asc')

          fireEvent.click(screen.getByRole('button', { name: /Created At/ }))
          await fetchesPollsForPage(0, 'created', 'desc')
        })
      })
    })

    describe('(Render)', () => {
      it('should match snapshot', async () => {
        const { asFragment } = render(<PollTable {...defaultProps} />)

        expect(asFragment()).toMatchSnapshot()
      })

      describe('loading', () => {
        it('should match snapshot', () => {
          const { asFragment } = render(
            <PollTable {...defaultProps} fetchPolls={jest.fn(() => new Promise(() => {}))} />
          )

          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('sort equals id desc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /ID/ }))
          })

          expect(screen.getByRole('button', { name: /ID/ }).childNodes[1]).toHaveClass('fa-sort-up')
        })
      })

      describe('sort equals id asc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /ID/ }))
          })
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /ID/ }))
          })

          expect(screen.getByRole('button', { name: /ID/ }).childNodes[1]).toHaveClass('fa-sort-down')
        })
      })

      describe('sort equals identifier asc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Identifier/ }))
          })

          expect(screen.getByRole('button', { name: /Identifier/ }).childNodes[1]).toHaveClass('fa-sort-up')
        })
      })

      describe('sort equals identifier desc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Identifier/ }))
          })
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Identifier/ }))
          })

          expect(screen.getByRole('button', { name: /Identifier/ }).childNodes[1]).toHaveClass('fa-sort-down')
        })
      })

      describe('sort equals question asc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Question/ }))
          })

          expect(screen.getByRole('button', { name: /Question/ }).childNodes[1]).toHaveClass('fa-sort-up')
        })
      })

      describe('sort equals question desc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Question/ }))
          })
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Question/ }))
          })

          expect(screen.getByRole('button', { name: /Question/ }).childNodes[1]).toHaveClass('fa-sort-down')
        })
      })

      describe('sort equals created asc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Created At/ }))
          })

          expect(screen.getByRole('button', { name: /Created At/ }).childNodes[1]).toHaveClass('fa-sort-up')
        })
      })

      describe('sort equals created desc', () => {
        it('should match snapshot', async () => {
          render(<PollTable {...defaultProps} />)
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Created At/ }))
          })
          await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Created At/ }))
          })

          expect(screen.getByRole('button', { name: /Created At/ }).childNodes[1]).toHaveClass('fa-sort-down')
        })
      })

      describe('with less than 1 page polls', () => {
        it('should match snapshot', () => {
          const { asFragment } = render(
            <PollTable {...defaultProps} polls={map((id) => ({ id }), [...Array(5).keys()])} pollCount={5} />
          )

          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('with no polls', () => {
        it('should match snapshot', () => {
          const { asFragment } = render(
            <PollTable {...defaultProps} polls={[]} pollCount={0} />
          )

          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})

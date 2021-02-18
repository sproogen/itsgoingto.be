import React from 'react'
import {
  render, screen, waitFor
} from '@testing-library/react'
import { APIError } from 'services/api'
import { Cookies } from 'react-cookie'
import Answer from './answer'

const mockHistory = {
  push: jest.fn()
}
jest.mock('react-router-dom', () => ({
  useHistory: () => mockHistory,
}))
jest.mock('react-countdown-now', () => () => <div>Mocked CountdownComponent</div>)
jest.mock('components/back', () => () => <div>Mocked BackComponent</div>)
jest.mock('./components/passphrase', () => () => <div>Mocked PassphraseComponent</div>)
jest.mock('./components/answers', () => () => <div>Mocked AnswersComponent</div>)

const defaultProps = {
  identifier: 'Hd2eJ9Jk',
  poll: {
    question: 'Question?',
    ended: false,
    multipleChoice: false,
  },
  hasPoll: true,
  requiresPassphrase: false,
  answers: [],
  totalResponses: 0,
  userResponded: false,
  hasUser: false,
  fetchPoll: jest.fn(() => Promise.resolve()),
  clearAnswers: jest.fn(),
  setLoading: jest.fn(),
  setRequiresPassphrase: jest.fn(),
  postResponse: jest.fn(),
  updateResponses: jest.fn(),
  updateUserResponses: jest.fn(),
  cookies: new Cookies(),
}

describe('(Route) answer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Lifecycle) component loaded', () => {
    describe('does not have poll', () => {
      it('should set loading', () => {
        render(<Answer {...defaultProps} hasPoll={false} />)
        expect(defaultProps.setLoading).toHaveBeenCalledWith(true)
      })
    })

    it('should clear answers', () => {
      render(<Answer {...defaultProps} />)
      expect(defaultProps.clearAnswers).toHaveBeenCalled()
    })

    it('should fetchPoll', () => {
      render(<Answer {...defaultProps} />)
      expect(defaultProps.fetchPoll).toHaveBeenCalled()
    })

    describe('poll succesfully fetched', () => {
      it('should set loading false', async () => {
        render(<Answer {...defaultProps} />)
        await waitFor(() => expect(defaultProps.setLoading).toHaveBeenCalledWith(false))
      })
    })

    describe('fetch poll returns poll not found', () => {
      it('should redirect to 404', async () => {
        const fetchPoll = jest.fn(() => Promise.resolve(new APIError({
          status: 404,
          error: { error: 'poll-not-found' },
        })))
        render(<Answer {...defaultProps} fetchPoll={fetchPoll} />)
        await waitFor(() => expect(mockHistory.push).toBeCalledWith('/404'))
      })
    })

    describe('fetch poll returns incorrect passphrase', () => {
      it('should call setRequiresPassphrase', async () => {
        const fetchPoll = jest.fn(() => Promise.resolve(new APIError({
          status: 403,
          error: { error: 'incorrect-passphrase' },
        })))
        render(<Answer {...defaultProps} fetchPoll={fetchPoll} />)
        await waitFor(() => expect(defaultProps.setRequiresPassphrase).toBeCalledWith(true))
      })
    })
  })

  // TODO: Test userID creation
  // TODO: Test sockets

  describe('(Render)', () => {
    describe('!hasPoll and requiresPassphrase', () => {
      beforeEach(() => {
        render(<Answer {...defaultProps} hasPoll={false} requiresPassphrase />)
      })

      it('shows the passphrase component', () => {
        expect(screen.getByText('Mocked PassphraseComponent')).toBeInTheDocument()
      })

      it('does not render the poll', () => {
        expect(screen.queryByTestId('answer-container')).not.toBeInTheDocument()
      })
    })

    describe('hasPoll', () => {
      beforeEach(() => {
        render(<Answer {...defaultProps} hasPoll />)
      })

      it('does not show the passphrase component', () => {
        expect(screen.queryByText('Mocked PassphraseComponent')).not.toBeInTheDocument()
      })

      it('renders the poll', () => {
        expect(screen.getByTestId('answer-container')).toBeInTheDocument()
        expect(screen.getByText('Question?')).toBeInTheDocument()
        expect(screen.getByText('Mocked AnswersComponent')).toBeInTheDocument()
      })
    })

    describe('Poll ended', () => {
      it('poll is ended', () => {
        render(
          <Answer
            {...defaultProps}
            poll={{
              ...defaultProps.poll,
              ended: true,
            }}
          />
        )
        expect(screen.getByText('This poll has now ended')).toBeInTheDocument()
      })
      it('poll is not ended', () => {
        render(
          <Answer
            {...defaultProps}
            poll={{
              ...defaultProps.poll,
              ended: false,
            }}
          />
        )
        expect(screen.queryByText('This poll has now ended')).not.toBeInTheDocument()
      })
    })

    describe('Poll has end date', () => {
      it('renders countdown component', () => {
        render(
          <Answer
            {...defaultProps}
            poll={{
              question: 'Question?',
              ended: false,
              endDate: { date: '22/11/2018' },
            }}
          />
        )
        expect(screen.getByText('Mocked CountdownComponent')).toBeInTheDocument()
      })
    })
  })
})

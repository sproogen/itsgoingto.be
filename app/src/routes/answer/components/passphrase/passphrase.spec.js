import React from 'react'
import {
  fireEvent, render, screen, act,
} from '@testing-library/react'
import EventBus from 'services/event-bus'
import { APIError } from 'services/api'
import Passphrase from './passphrase'

const eventBus = {
  emit: jest.fn(),
  addListener: jest.fn(),
}

EventBus.getEventBus = jest.fn(() => eventBus)

const defaultProps = {
  identifier: 'Hd2eJ9Jk',
  setPassphrase: jest.fn(() => Promise.resolve()),
  fetchPoll: jest.fn(() => Promise.resolve()),
  setRequiresPassphrase: jest.fn(() => Promise.resolve()),
}

describe('(Route) answer', () => {
  describe('(Component) passphrase', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) onKeyDown', () => {
      describe('key is KEY_ENTER', () => {
        it('emits focus request on index + 1', () => {
          render(<Passphrase {...defaultProps} />)

          const input = screen.getByLabelText('Passphrase')
          fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, charCode: 13 })
          expect(eventBus.emit).toHaveBeenCalledWith('passphrase-submit')
        })
      })
    })

    describe('(Action) submit', () => {
      it('should call setPassphrase with the value', async () => {
        render(<Passphrase {...defaultProps} />)

        const input = screen.getByLabelText('Passphrase')
        fireEvent.change(input, { target: { value: 'passphrase' } })

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-Enter'))
        })

        expect(defaultProps.setPassphrase).toHaveBeenCalledWith('Hd2eJ9Jk', 'passphrase')
      })

      it('should call fetchPoll with the identifier', async () => {
        render(<Passphrase {...defaultProps} />)

        const input = screen.getByLabelText('Passphrase')
        fireEvent.change(input, { target: { value: 'passphrase' } })

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-Enter'))
        })

        expect(defaultProps.fetchPoll).toHaveBeenCalledWith(defaultProps.identifier)
      })

      it('should call setRequiresPassphrase with valid poll response', async () => {
        render(<Passphrase {...defaultProps} />)

        const input = screen.getByLabelText('Passphrase')
        fireEvent.change(input, { target: { value: 'passphrase' } })

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-Enter'))
        })

        expect(defaultProps.setRequiresPassphrase).toHaveBeenCalledWith(false)
      })

      it('should set error to true with invalid poll response', async () => {
        const fetchPoll = jest.fn(() => Promise.resolve(new APIError('failed')))
        render(<Passphrase {...defaultProps} fetchPoll={fetchPoll} />)

        const input = screen.getByLabelText('Passphrase')
        fireEvent.change(input, { target: { value: 'passphrase' } })

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-Enter'))
        })

        expect(screen.getByText('Passphrase incorrect')).toBeInTheDocument()
      })
    })
  })
})

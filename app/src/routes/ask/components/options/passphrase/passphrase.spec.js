import React from 'react'
import {
  render, fireEvent, screen,
} from '@testing-library/react'
import Passphrase from './passphrase'

const defaultProps = {
  poll: { passphrase: 'Password' },
  updateOptions: jest.fn(),
}

describe('(Route) Ask', () => {
  describe('(Component) Passphrase', () => {
    describe('(Action) onChange', () => {
      it('should call prop onAnswerChange', () => {
        render(<Passphrase {...defaultProps} />)

        const input = screen.getByLabelText('Set a passphrase (optional)')
        fireEvent.change(input, { target: { value: 'New Password' } })

        expect(defaultProps.updateOptions).toHaveBeenCalledWith({
          identifier : '',
          passphrase : 'New Password',
        })
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Passphrase {...defaultProps} />)

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

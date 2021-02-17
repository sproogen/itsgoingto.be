import React from 'react'
import { render, screen } from '@testing-library/react'
import Options from './options'

const defaultProps = {
  hasQuestion: true,
  poll: { question: 'Question', answers: [] },
  updateOptions: () => {}
}

describe('(Route) Ask', () => {
  describe('(Component) Options', () => {
    describe('(Render)', () => {
      describe('when hasQuestion is false', () => {
        it('options has class gone', () => {
          render(<Options {...defaultProps} hasQuestion={false} />)

          const options = screen.getByTestId('options')
          expect(options).toHaveClass('gone')
        })
      })

      describe('when hasQuestion is true', () => {
        it('options does not have class gone', () => {
          render(<Options {...defaultProps} hasQuestion />)

          const options = screen.getByTestId('options')
          expect(options).not.toHaveClass('gone')
        })
      })
      it('matches snapshot', () => {
        const { asFragment } = render(<Options {...defaultProps} />)

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

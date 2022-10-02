import React from 'react'
import { render } from '@testing-library/react'
import Options from './options'

const defaultProps = {
  poll: { question: 'Question', answers: [] },
  updateOptions: () => { /* Do nothing */ },
}

describe('(Route) Ask', () => {
  describe('(Component) Options', () => {
    describe('(Render)', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Options {...defaultProps} />)

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

import React from 'react'
import {
  render
} from '@testing-library/react'
import Sharing from './sharing'

const defaultProps = {
  poll: {
    question: 'This is a question',
  },
}

describe('(Route) answer', () => {
  describe('(Component) sharing', () => {
    describe('(Render)', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Sharing {...defaultProps} />)
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

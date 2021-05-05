import React from 'react'
import { render } from '@testing-library/react'
import Spinner from './spinner'

describe('(Component) Spinner', () => {
  describe('(Render)', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<Spinner />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import WithRouter from '../../../test-utils/with-router'
import NotFound from './not-found'

describe('(Route) NotFound', () => {
  describe('(Render)', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<NotFound />, {
        wrapper: WithRouter
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import WithRouter from '../../../test-utils/with-router'
import Back from './back'

describe('(Component) Back', () => {
  describe('(Render)', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<Back />, {
        wrapper: WithRouter
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})

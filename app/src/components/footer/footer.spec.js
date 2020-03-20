import React from 'react'
import { render } from '@testing-library/react'
import Footer from 'components/footer'

describe('(Layout) Footer', () => {
  describe('(Render)', () => {
    it('matchs snapshot', () => {
      const { asFragment } = render(<Footer />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import Loader from './loader'

describe('(Component) Loader', () => {
  describe('(Render)', () => {
    describe('when prop isLoading is false', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Loader isLoading={false} />)

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when prop isLoading is true', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<Loader isLoading />)

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

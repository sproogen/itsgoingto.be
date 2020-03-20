import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import WordRotate from './word-rotate'

describe('(Component) WordRotate', () => {
  describe('(Render)', () => {
    jest.useFakeTimers()
    let renderResult

    beforeEach(() => {
      renderResult = render(<WordRotate words="word1,word2" />)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })

    describe('initial word (first word)', () => {
      it('matches snapshot', () => {
        const { asFragment } = renderResult

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('after interval passed (second word)', () => {
      it('matches snapshot', () => {
        const { asFragment } = renderResult

        act(() => {
          jest.advanceTimersByTime(5000)
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('after interval passed (back to first word)', () => {
      it('matches snapshot', () => {
        const { asFragment } = renderResult

        act(() => {
          jest.advanceTimersByTime(10000)
        })

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})

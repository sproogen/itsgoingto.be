/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import Loader from './loader'

describe('(Component) Loader', () => {
  describe('(Render)', () => {
    describe('when prop isLoading is false', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Loader isLoading={false} />)

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when prop isLoading is true', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Loader isLoading={true} />)

        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import NotFound from './not-found'

describe('(Route) NotFound', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<NotFound />)
  })

  describe('(Render)', () => {
    it('matches snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
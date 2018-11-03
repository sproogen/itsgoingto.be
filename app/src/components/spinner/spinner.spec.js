/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import Spinner from './spinner'

describe('(Component) Spinner', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Spinner />)
  })

  describe('(Render)', () => {
    it('matches snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})

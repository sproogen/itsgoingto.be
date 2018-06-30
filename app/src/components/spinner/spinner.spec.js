/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import Spinner from './spinner'

describe('(Component) Spinner', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Spinner />)
  })

  describe('(Render) snapshot', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})

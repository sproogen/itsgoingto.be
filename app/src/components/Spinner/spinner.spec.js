/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import Spinner from './Spinner'

describe('(Component) Spinner', () => {
  let wrapper

  describe('(Render) Spinner', () => {
    beforeEach(() => {
      wrapper = shallow(<Spinner />)
    })

    it('renders with class spinner', () => {
      expect(wrapper.name()).toBe('div')
      expect(wrapper.hasClass('spinner')).toBe(true)
    })

    it('Should render three spans', () => {
      expect(wrapper.find('span')).toHaveLength(3)
    })
  })
})

/* global expect */
import React from 'react'
import Footer from 'layouts/footer'
import { shallow } from 'enzyme'

describe('(Layout) Footer', () => {
  describe('(Render)', () => {
    it('matchs snapshot', () => {
      const wrapper = shallow(<Footer />)

      expect(wrapper).toMatchSnapshot()
    })
  })
})

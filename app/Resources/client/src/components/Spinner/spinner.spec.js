/* eslint-env mocha */
/* global expect */
import React from 'react'
import { shallow, mount } from 'enzyme'
import Spinner from './Spinner'

describe('(Component) Spinner', () => {
  let wrapper

  describe('(Render) Spinner', () => {
    beforeEach(() => {
      wrapper = shallow(<Spinner />)
    })

    it('renders as a Spinner', () => {
      wrapper = mount(<Spinner />)
      expect(wrapper.name()).to.equal('Spinner')
    })

    it('renders with class spinner', () => {
      expect(wrapper.name()).to.equal('div')
      expect(wrapper.hasClass('spinner')).to.equal(true)
    })

    it('Should render three spans', () => {
      expect(wrapper.find('span')).to.have.length(3)
    })
  })
})

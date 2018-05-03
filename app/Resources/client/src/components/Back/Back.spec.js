/* eslint-env mocha */
/* global expect, sinon */
import React from 'react'
import { browserHistory } from 'react-router'
import { shallow, mount } from 'enzyme'
import Back from './Back'

describe('(Component) Back', () => {
  const wrapper = shallow(<Back />)

  describe('(Render) Back', () => {
    it('renders as a Back', () => {
      const wrapper = mount(<Back />)

      expect(wrapper.name()).to.equal('Back')
    })

    it('renders as a .container', () => {
      expect(wrapper.name()).to.equal('div')
      expect(wrapper.hasClass('container')).to.equal(true)
    })

    it('Should render the icon and text', () => {
      wrapper.find('a').should.contain(<i className='fa fa-arrow-left' />)
      expect(wrapper.find('a').text()).to.equal(' New Poll')
    })

    describe('clickEvent', () => {
      const wrapper = mount(<Back />)
      const spy = sinon.spy(browserHistory, 'push')

      it('Should call submit', () => {
        wrapper.find('a').simulate('click')
        spy.should.have.been.calledWith('/')
      })
    })
  })
})

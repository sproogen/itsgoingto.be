/* global expect, jest */
import React from 'react'
import { browserHistory } from 'react-router'
import { shallow } from 'enzyme'
import Back from './Back'

describe('(Component) Back', () => {
  const wrapper = shallow(<Back />)

  describe('(Render) Back', () => {
    it('renders as a .container', () => {
      expect(wrapper.name()).toBe('div')
      expect(wrapper.hasClass('container')).toBe(true)
    })

    it('Should render the icon and text', () => {
      wrapper.find('a').should.contain(<i className='fa fa-arrow-left' />)
      expect(wrapper.find('a').text()).toBe(' New Poll')
    })

    describe('clickEvent', () => {
      browserHistory.push = jest.fn()

      it('Should call submit', () => {
        wrapper.find('a').simulate('click')
        expect(browserHistory.push).toBeCalledWith('/')
      })
    })
  })
})

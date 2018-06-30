/* global expect, jest */
import React from 'react'
import { browserHistory } from 'react-router'
import { shallow } from 'enzyme'
import Back from './back'

describe('(Component) Back', () => {
  const wrapper = shallow(<Back />)

  describe('(Render) snapshot', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    })
  })

  describe('(Action) onClick', () => {
    browserHistory.push = jest.fn()

    it('should call submit', () => {
      wrapper.find('a').simulate('click')
      expect(browserHistory.push).toBeCalledWith('/')
    })
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import Back from './back'

let wrapper

describe('(Component) Back', () => {
  beforeEach(() => {
    wrapper = shallow(<Back />)
  })

  describe('(Action) onClick', () => {
    browserHistory.push = jest.fn()

    it('should call submit', () => {
      wrapper.find('a').simulate('click')
      expect(browserHistory.push).toBeCalledWith('/')
    })
  })

  describe('(Render)', () => {
    it('matches snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})

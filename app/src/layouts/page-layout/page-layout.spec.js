/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import { browserHistory } from 'react-router'
import { Cookies } from 'react-cookie'
import { PageLayout } from 'layouts/page-layout/page-layout'

browserHistory.push = jest.fn()

const Child = () => <h2>child</h2>
const cookies = new Cookies()
cookies.remove = jest.fn()
const props = {
  children: <Child />,
  isLoading: false,
  hasUser: false,
  clearUser: jest.fn(),
  cookies,
}

describe('(Layout) PageLayout', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Action) View polls click', () => {
    it('should redirect to admin route', () => {
      const wrapper = shallow(<PageLayout {...props} hasUser />)

      wrapper.find('#view-polls').props().onClick()
      expect(browserHistory.push).toBeCalledWith('/admin')
    })
  })

  describe('(Action) Logout click', () => {
    beforeEach(() => {
      const wrapper = shallow(<PageLayout {...props} hasUser />)
      wrapper.find('#logout').props().callback()
    })

    it('should call prop clearUser', () => {
      expect(props.clearUser).toBeCalled()
    })

    it('should redirect to login route', () => {
      expect(browserHistory.push).toBeCalledWith('/login')
    })
  })

  describe('(Render)', () => {
    it('matchs snapshot', () => {
      const wrapper = shallow(<PageLayout {...props} />)

      expect(wrapper).toMatchSnapshot()
    })

    describe('with prop isLoading true', () => {
      it('matchs snapshot', () => {
        const wrapper = shallow(<PageLayout {...props} isLoading />)

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with prop hasUser true', () => {
      it('matchs snapshot', () => {
        const wrapper = shallow(<PageLayout {...props} hasUser />)

        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})

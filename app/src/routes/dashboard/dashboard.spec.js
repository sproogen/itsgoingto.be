/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { browserHistory } from 'react-router'
import { Dashboard } from './dashboard'

browserHistory.push = jest.fn()

const props = {
  hasUser: false,
  setLoading: jest.fn(),
}

describe('(Route) Login', () => {
  describe('(Lifecycle) componentDidMount', () => {
    describe('checkPermissions', () => {
      beforeEach(() => {
        shallow(<Dashboard {...props} />)
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      describe('hasUser false', () => {
        it('should call setLoading true', () => {
          expect(props.setLoading).toHaveBeenCalledTimes(1)
          expect(props.setLoading).toHaveBeenCalledWith(true)
        })

        it('should redirect to /login', () => {
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
          expect(browserHistory.push).toHaveBeenCalledWith('/login')
        })
      })

      describe('hasUser true', () => {
        it('should call setLoading false', () => {
          jest.clearAllMocks()
          shallow(<Dashboard {...props} hasUser />)

          expect(props.setLoading).toHaveBeenCalledTimes(1)
          expect(props.setLoading).toHaveBeenCalledWith(false)
        })
      })
    })
  })

  describe('(Lifecycle) componentDidUpdate', () => {
    describe('checkPermissions', () => {
      beforeEach(() => {
        const wrapper = shallow(<Dashboard {...props} />)
        jest.clearAllMocks()
        wrapper.setProps()
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      describe('hasUser false', () => {
        it('should call setLoading true', () => {
          expect(props.setLoading).toHaveBeenCalledTimes(1)
          expect(props.setLoading).toHaveBeenCalledWith(true)
        })

        it('should redirect to /login', () => {
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
          expect(browserHistory.push).toHaveBeenCalledWith('/login')
        })
      })

      describe('hasUser true', () => {
        it('should call setLoading false', () => {
          const wrapper = shallow(<Dashboard {...props} hasUser />)
          jest.clearAllMocks()
          wrapper.setProps()

          expect(props.setLoading).toHaveBeenCalledTimes(1)
          expect(props.setLoading).toHaveBeenCalledWith(false)
        })
      })
    })
  })

  describe('(Render)', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallow(<Dashboard {...props} />)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('hasUser false', () => {
      it('matches snapshot', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('hasUser true', () => {
      it('matches snapshot', () => {
        wrapper.setProps({ hasUser: true })
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})

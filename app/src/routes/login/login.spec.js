/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Cookies } from 'react-cookie'
import { browserHistory } from 'react-router'
import EventBus from 'components/event-bus'
import { APIError } from 'services/api'
import { Login } from './login'

const cookies = new Cookies()
const eventBus = {
  emit: jest.fn(),
}

cookies.remove = jest.fn()
cookies.set = jest.fn()
EventBus.getEventBus = jest.fn(() => eventBus)
browserHistory.push = jest.fn()

const props = {
  postLogin: jest.fn(() => Promise.resolve({ token: 'loginToken' })),
  hasUser: false,
  setLoading: jest.fn(),
  clearUser: jest.fn(),
  cookies,
}

describe('(Route) Login', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Login {...props} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Lifecycle) componentDidMount', () => {
    describe('doesn\'t have user', () => {
      it('should call clearUser', () => {
        expect(props.clearUser).toHaveBeenCalledTimes(0)
      })

      it('should remove cookie', () => {
        expect(cookies.remove).toHaveBeenCalledTimes(0)
      })
    })
    describe('has user', () => {
      beforeEach(() => {
        wrapper = shallow(<Login {...props} hasUser />)
      })

      it('should call clearUser', () => {
        expect(props.clearUser).toHaveBeenCalledTimes(1)
      })

      it('should remove cookie', () => {
        expect(cookies.remove).toHaveBeenCalledTimes(1)
        expect(cookies.remove).toBeCalledWith('itsgoingtobeUserToken', { path: '/' })
      })
    })
    it('should call setLoading false', () => {
      expect(props.setLoading).toHaveBeenCalledTimes(1)
      expect(props.setLoading).toBeCalledWith(false)
    })
  })

  describe('(Action) Submit click', () => {
    describe('validation', () => {
      it('should resolve empty promise if validations fails', () => {
        wrapper.setState({ data: { username: 'username', password: '' } })

        expect(wrapper.find('#submit').props().callback()).resolves.toBeUndefined()
      })

      describe('username', () => {
        it('should add error if fails validation', () => {
          wrapper.setState({ data: { username: '', password: '' } })
          wrapper.find('#submit').props().callback()

          expect(wrapper.state().errors.username).toEqual('Please enter a username.')
        })

        it('should remove error if passes validation', () => {
          wrapper.setState({
            data: { username: 'username', password: '' },
            errors: { username: 'Please enter a username.' },
          })
          wrapper.find('#submit').props().callback()

          expect(wrapper.state().errors.username).toBeUndefined()
        })
      })

      describe('password', () => {
        it('should add error if fails validation', () => {
          wrapper.setState({ data: { username: '', password: '' } })
          wrapper.find('#submit').props().callback()

          expect(wrapper.state().errors.password).toEqual('Please enter a password.')
        })

        it('should remove error if passes validation', () => {
          wrapper.setState({
            data: { username: '', password: 'password' },
            errors: { password: 'Please enter a password.' },
          })
          wrapper.find('#submit').props().callback()

          expect(wrapper.state().errors.password).toBeUndefined()
        })
      })
    })

    it('should call postLogin if validation passes', () => {
      wrapper.setState({ data: { username: 'username', password: 'password' } })
      wrapper.find('#submit').props().callback()

      expect(props.postLogin).toHaveBeenCalledTimes(1)
      expect(props.postLogin).toBeCalledWith('username', 'password')
    })

    describe('postLogin success', () => {
      beforeEach(() => {
        wrapper.setState({ data: { username: 'username', password: 'password' } })
      })

      it('should call setLoading with true', () => {
        return wrapper.find('#submit').props().callback().then(() => {
          expect(props.setLoading).toHaveBeenCalledWith(true)
        })
      })

      it('should set a user token cookie', () => {
        return wrapper.find('#submit').props().callback().then(() => {
          expect(cookies.set).toHaveBeenCalledWith('itsgoingtobeUserToken', 'loginToken', { path: '/', maxAge: 3600 })
        })
      })

      it('should redirect to /admin', () => {
        return wrapper.find('#submit').props().callback().then(() => {
          expect(browserHistory.push).toHaveBeenCalledWith('/admin')
        })
      })
    })

    describe('postLogin failure', () => {
      it('should set state with api errors', () => {
        const postLogin = jest.fn(() => Promise.resolve(new APIError({
          error: { errors: [ 'There was an error 1', 'There was an error 2' ] }
        })))

        wrapper = shallow(<Login {...props} postLogin={postLogin} />)
        wrapper.setState({ data: { username: 'username', password: 'password' } })

        return wrapper.find('#submit').props().callback().then(() => {
          expect(wrapper.state().errors.api).toEqual('There was an error 1<br />There was an error 2')
        })
      })

      it('should set state with unknown error', () => {
        const postLogin = jest.fn(() => Promise.resolve(new APIError('failed')))

        wrapper = shallow(<Login {...props} postLogin={postLogin} />)
        wrapper.setState({ data: { username: 'username', password: 'password' } })

        return wrapper.find('#submit').props().callback().then(() => {
          expect(wrapper.state().errors.api).toEqual('There was an unknown error.')
        })
      })
    })
  })

  describe('(Action) Username onChange', () => {
    const event = {
      target: { id: 'username', value: 'A username' }
    }

    it('should update state', () => {
      wrapper.find('#username').simulate('change', event)

      expect(wrapper.state().data.username).toEqual('A username')
    })

    it('should remove error if passes validation', () => {
      wrapper.setState({ errors: { username: 'There is an error' } })
      wrapper.find('#username').simulate('change', event)

      expect(wrapper.state().errors.username).toBeUndefined()
    })

    it('should not remove error if fails validation', () => {
      wrapper.setState({ errors: { username: 'There is an error' } })
      wrapper.find('#username').simulate('change', { target: { id: 'username', value: '' } })

      expect(wrapper.state().errors.username).toEqual('There is an error')
    })

    it('should not add error if fails validation', () => {
      wrapper.setState({ errors: { username: '' } })
      wrapper.find('#username').simulate('change', { target: { id: 'username', value: '' } })

      expect(wrapper.state().errors.username).toEqual('')
    })
  })

  describe('(Action) Password onChange', () => {
    const event = {
      target: { id: 'password', value: 'A password' }
    }

    it('should update state', () => {
      wrapper.find('#password').simulate('change', event)

      expect(wrapper.state().data.password).toEqual('A password')
    })

    it('should remove error if passes validation', () => {
      wrapper.setState({ errors: { password: 'There is an error' } })
      wrapper.find('#password').simulate('change', event)

      expect(wrapper.state().errors.password).toBeUndefined()
    })

    it('should not remove error if fails validation', () => {
      wrapper.setState({ errors: { password: 'There is an error' } })
      wrapper.find('#password').simulate('change', { target: { id: 'password', value: '' } })

      expect(wrapper.state().errors.password).toEqual('There is an error')
    })

    it('should not add error if fails validation', () => {
      wrapper.setState({ errors: { password: '' } })
      wrapper.find('#password').simulate('change', { target: { id: 'password', value: '' } })

      expect(wrapper.state().errors.password).toEqual('')
    })
  })

  describe('(Action) Password onKeyPress', () => {
    it('should emit \'login-submit\' to eventBus on KEY_ENTER', () => {
      wrapper.find('#password').simulate('keyDown', { keyCode: 13 })
      expect(eventBus.emit).toHaveBeenCalledWith('login-submit')
    })
  })

  describe('(Render)', () => {
    describe('initial login page', () => {
      it('matches snapshot', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with data', () => {
      it('matches snapshot', () => {
        wrapper.setState({ data : { username: 'username', password: 'password' } })

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with username error', () => {
      it('matches snapshot', () => {
        wrapper.setState({ errors: { username: 'There is an error' } })

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with password error', () => {
      it('matches snapshot', () => {
        wrapper.setState({ errors: { password: 'There is an error' } })

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with api error', () => {
      it('matches snapshot', () => {
        wrapper.setState({ errors: { api: 'There is an API error' } })

        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})

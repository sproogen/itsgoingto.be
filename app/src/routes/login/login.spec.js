import React from 'react'
import {
  render, fireEvent, screen, act
} from '@testing-library/react'
import { Cookies } from 'react-cookie'
import EventBus from 'services/event-bus'
import { APIError } from 'services/api'
import Login from './login'

const cookies = new Cookies()
const eventBus = {
  emit: jest.fn(),
  addListener: jest.fn()
}
const mockHistory = {
  push: jest.fn()
}
jest.mock('react-router-dom', () => ({
  useHistory: () => mockHistory
}))
jest.mock('components/back', () => () => <div>Mocked BackComponent</div>)

cookies.remove = jest.fn()
cookies.set = jest.fn()
EventBus.getEventBus = jest.fn(() => eventBus)

const defaultProps = {
  postLogin: jest.fn(() => Promise.resolve({ token: 'loginToken' })),
  hasUser: false,
  setLoading: jest.fn(),
  clearUser: jest.fn(),
  cookies,
}

describe('(Route) Login', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Lifecycle) component did load', () => {
    describe('doesn\'t have user', () => {
      it('should not call clearUser', () => {
        render(<Login {...defaultProps} />)

        expect(defaultProps.clearUser).toHaveBeenCalledTimes(0)
      })

      it('should not remove cookie', () => {
        render(<Login {...defaultProps} />)

        expect(cookies.remove).toHaveBeenCalledTimes(0)
      })
    })

    describe('has user', () => {
      beforeEach(() => {
        render(<Login {...defaultProps} hasUser />)
      })

      it('should call clearUser', () => {
        expect(defaultProps.clearUser).toHaveBeenCalledTimes(1)
      })

      it('should remove cookie', () => {
        expect(cookies.remove).toHaveBeenCalledTimes(1)
        expect(cookies.remove).toBeCalledWith('itsgoingtobeUserToken', { path: '/' })
      })
    })

    it('should call setLoading false', () => {
      render(<Login {...defaultProps} hasUser />)

      expect(defaultProps.setLoading).toHaveBeenCalledTimes(1)
      expect(defaultProps.setLoading).toBeCalledWith(false)
    })
  })

  describe('(Action) Submit click', () => {
    describe('validation', () => {
      describe('username', () => {
        it('should add error if fails validation', async () => {
          render(<Login {...defaultProps} />)

          const button = screen.getByTestId('button-Login')
          await act(async () => {
            fireEvent.click(button)
          })

          expect(screen.getByText('Please enter a username.')).toBeInTheDocument()
        })

        // TODO: Why doesn't this work
        // it('should remove error when changing input field', async () => {
        //   render(<Login {...defaultProps} />)

        //   const button = screen.getByTestId('button-Login')
        //   await act(async () => {
        //     fireEvent.click(button)
        //   })

        //   const input = screen.getByLabelText('Username')
        //   fireEvent.change(input, { target: { value: 'Username' } })

        //   await waitForElementToBeRemoved(() => screen.queryByText('Please enter a username.'))
        // })

        it('should not add error when changing input field', async () => {
          render(<Login {...defaultProps} />)

          const input = screen.getByLabelText('Username')
          fireEvent.change(input, { target: { value: '' } })

          expect(screen.queryByText('Please enter a username.')).not.toBeInTheDocument()
        })
      })

      describe('password', () => {
        it('should add error if fails validation', async () => {
          render(<Login {...defaultProps} />)

          const button = screen.getByTestId('button-Login')
          await act(async () => {
            fireEvent.click(button)
          })

          expect(screen.getByText('Please enter a password.')).toBeInTheDocument()
        })

        // TODO: Why doesn't this work
        // it('should remove error when changing input field', async () => {
        //   render(<Login {...defaultProps} />)

        //   const button = screen.getByTestId('button-Login')
        //   await act(async () => {
        //     fireEvent.click(button)
        //   })

        //   const input = screen.getByLabelText('Password')
        //   fireEvent.change(input, { target: { value: 'password' } })

        //   await waitForElementToBeRemoved(() => screen.queryByText('Please enter a password.'))
        // })

        it('should not add error when changing input field', async () => {
          render(<Login {...defaultProps} />)

          const input = screen.getByLabelText('Password')
          fireEvent.change(input, { target: { value: '' } })

          expect(screen.queryByText('Please enter a password.')).not.toBeInTheDocument()
        })
      })
    })

    it('should call postLogin if validation passes', async () => {
      render(<Login {...defaultProps} />)

      const usernameInput = screen.getByLabelText('Username')
      fireEvent.change(usernameInput, { target: { value: 'username' } })

      const passwordInput = screen.getByLabelText('Password')
      fireEvent.change(passwordInput, { target: { value: 'password' } })

      const button = screen.getByTestId('button-Login')
      await act(async () => {
        fireEvent.click(button)
      })

      expect(defaultProps.postLogin).toHaveBeenCalledTimes(1)
      expect(defaultProps.postLogin).toBeCalledWith('username', 'password')
    })

    describe('postLogin success', () => {
      beforeEach(() => {
        render(<Login {...defaultProps} />)

        const usernameInput = screen.getByLabelText('Username')
        fireEvent.change(usernameInput, { target: { value: 'username' } })

        const passwordInput = screen.getByLabelText('Password')
        fireEvent.change(passwordInput, { target: { value: 'password' } })
      })

      it('should call setLoading with true', async () => {
        const button = screen.getByTestId('button-Login')
        await act(async () => {
          fireEvent.click(button)
        })

        expect(defaultProps.setLoading).toHaveBeenCalledWith(true)
      })

      it('should set a user token cookie', async () => {
        const button = screen.getByTestId('button-Login')
        await act(async () => {
          fireEvent.click(button)
        })

        expect(cookies.set).toHaveBeenCalledWith('itsgoingtobeUserToken', 'loginToken', { path: '/', maxAge: 3600 })
      })

      it('should redirect to /admin', async () => {
        const button = screen.getByTestId('button-Login')
        await act(async () => {
          fireEvent.click(button)
        })

        expect(mockHistory.push).toHaveBeenCalledWith('/admin')
      })
    })

    describe('postLogin failure', () => {
      it('should set state with api errors', async () => {
        const postLogin = jest.fn(() => Promise.resolve(new APIError({
          error: { errors: ['There was an error 1', 'There was an error 2'] }
        })))

        render(<Login {...defaultProps} postLogin={postLogin} />)

        const usernameInput = screen.getByLabelText('Username')
        fireEvent.change(usernameInput, { target: { value: 'username' } })

        const passwordInput = screen.getByLabelText('Password')
        fireEvent.change(passwordInput, { target: { value: 'password' } })
        const button = screen.getByTestId('button-Login')
        await act(async () => {
          fireEvent.click(button)
        })

        expect(screen.getByText('There was an error 1<br />There was an error 2')).toBeInTheDocument()
      })

      it('should set state with unknown error', async () => {
        const postLogin = jest.fn(() => Promise.resolve(new APIError('failed')))

        render(<Login {...defaultProps} postLogin={postLogin} />)

        const usernameInput = screen.getByLabelText('Username')
        fireEvent.change(usernameInput, { target: { value: 'username' } })

        const passwordInput = screen.getByLabelText('Password')
        fireEvent.change(passwordInput, { target: { value: 'password' } })
        const button = screen.getByTestId('button-Login')
        await act(async () => {
          fireEvent.click(button)
        })

        expect(screen.getByText('There was an unknown error.')).toBeInTheDocument()
      })
    })
  })

  describe('(Action) Password onKeyPress', () => {
    it('should emit \'login-submit\' to eventBus on KEY_ENTER', () => {
      render(<Login {...defaultProps} />)

      const passwordInput = screen.getByLabelText('Password')
      fireEvent.keyDown(passwordInput, { key: 'Enter', keyCode: 13, charCode: 13 })

      expect(eventBus.emit).toHaveBeenCalledWith('login-submit')
    })
  })

  describe('(Render)', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<Login {...defaultProps} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})

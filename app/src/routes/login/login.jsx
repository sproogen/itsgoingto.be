import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Cookies } from 'react-cookie'
import { isEmpty, dissoc, join } from 'ramda'
import { APIError } from 'services/api'
import EventBus from 'services/event-bus'
import Button from 'components/button'
import './login.scss'

const KEY_ENTER = 13

const Login = ({
  setLoading, hasUser, clearUser, cookies, postLogin
}) => {
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const eventListener = useRef(EventBus.getEventBus())

  const validate = (removeOnly = false) => {
    let newErrors = dissoc('api', errors)

    if (username.length === 0) {
      if (!removeOnly) {
        newErrors.username = 'Please enter a username.'
      }
    } else {
      newErrors = dissoc('username', newErrors)
    }

    if (password.length === 0) {
      if (!removeOnly) {
        newErrors.password = 'Please enter a password.'
      }
    } else {
      newErrors = dissoc('password', newErrors)
    }

    setErrors(newErrors)

    return isEmpty(newErrors)
  }

  const onUsernameChange = ({ target }) => {
    setUsername(target.value)
    validate(true)
  }

  const onPasswordChange = ({ target }) => {
    setPassword(target.value)
    validate(true)
  }

  const handleKeyPress = (event) => {
    const key = event.keyCode || event.charCode

    if (key === KEY_ENTER) {
      eventListener.current.emit('login-submit')
    }
  }

  const submit = () => {
    if (validate()) {
      return postLogin(username, password).then((response) => {
        if (response instanceof APIError) {
          const newErrors = {}

          try {
            newErrors.api = join('<br />', response.details.error.errors)
          } catch (err) {
            newErrors.api = 'There was an unknown error.'
          }
          setErrors(newErrors)
          return true
        }
        setLoading(true)
        cookies.set('itsgoingtobeUserToken', response.token, { path: '/', maxAge: 3600 })
        history.push('/admin')
        return false
      })
    }
    return Promise.resolve()
  }

  useEffect(() => {
    if (hasUser) {
      clearUser()
      cookies.remove('itsgoingtobeUserToken', { path: '/' })
    }

    setLoading(false)
  }, [])

  return (
    <div>
      <div className="container header-container">
        <div className="header center-text">
          <h1>Login</h1>
        </div>
      </div>
      <div className="container login-container">
        <div className={`input input-username${errors.username || errors.api ? ' input-error' : ''}`}>
          <label className="input-label input-label-username" htmlFor="username">
            Username
            <input
              className="input-field input-field-username"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onUsernameChange}
            />
          </label>
          <span className="input-error-label">{errors.username}</span>
        </div>
        <div className={`input input-password${errors.password || errors.api ? ' input-error' : ''}`}>
          <label className="input-label input-label-password" htmlFor="password">
            Password
            <input
              className="input-field input-field-password"
              type="password"
              id="password"
              name="password"
              value={password}
              onKeyDown={handleKeyPress}
              onChange={onPasswordChange}
            />
          </label>
          <span className="input-error-label">{errors.password || errors.api}</span>
        </div>
        <Button
          className="pull-right btn--small"
          text="Login"
          id="submit"
          disabled={!isEmpty(errors)}
          callback={submit}
          submitEvent="login-submit"
        />
      </div>
    </div>
  )
}

Login.propTypes = {
  postLogin: PropTypes.func.isRequired,
  hasUser: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
}

export default Login

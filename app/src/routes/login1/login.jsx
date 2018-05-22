import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { withCookies, Cookies } from 'react-cookie'
import { isEmpty, dissoc, join } from 'ramda'
import { postLogin, APIError } from 'store/api'
import { hasUserSelector } from 'store/user'
import { setLoading } from 'store/loader'
import Button from 'components/button'
import EventBus from 'components/event-bus'
import Back from 'components/back'
import './login.scss'

const KEY_ENTER = 13

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data : {
        username : '',
        password : '',
      },
      errors : { },
      loading: false,
    }

    if (props.hasUser) {
      props.setLoading(true)
      this.state.loading = true
      browserHistory.push('/admin')
    }
  }

  componentWillMount = () => {
    const { setLoading } = this.props

    setLoading(false)
    this.eventBus = EventBus.getEventBus()
  }

  handleChange = ({ target }) => {
    const data = { ...this.state.data, [target.id] : target.value }

    this.setState({ data })
    this.validate(true, data)
  }

  validate = (removeOnly = false, data) => {
    if (!data) {
      data = this.state.data
    }
    const { username, password } = data
    let { errors } = this.state

    errors = dissoc('api', errors)

    if (username.length === 0) {
      if (!removeOnly) {
        errors.username = 'Please enter a username.'
      }
    } else {
      errors = dissoc('username', errors)
    }

    if (password.length === 0) {
      if (!removeOnly) {
        errors.password = 'Please enter a password.'
      }
    } else {
      errors = dissoc('password', errors)
    }

    this.setState({ errors })

    return isEmpty(errors)
  }

  handleKeyPress = (event) => {
    event = event || window.event
    const key = event.keyCode || event.charCode

    if (key === KEY_ENTER) {
      this.eventBus.emit('login-submit')
    }
  }

  submit = () => {
    const { data : { username, password } } = this.state
    const { postLogin, cookies, setLoading } = this.props

    if (this.validate()) {
      return postLogin(username, password).then((response) => {
        if (response instanceof APIError) {
          const errors = {}

          try {
            errors.api = join('<br />', response.details.error.errors)
          } catch (err) {
            errors.api = 'There was an unknown error.'
          }
          this.setState({ errors })
          return true
        } else {
          setLoading(true)
          cookies.set('itsgoingtobeUserToken', response.token, { path: '/', maxAge: 3600 })
          browserHistory.push('/admin')
          return false
        }
      })
    } else {
      return Promise.resolve()
    }
  }

  render () {
    const { data : { username, password }, errors, loading } = this.state

    if (loading) {
      return <div />
    }

    join('-', ['1', '2', '3'])

    return (
      <div>
        <Back />
        <div className='container header-container'>
          <div className='header center-text'>
            <h1>Login</h1>
          </div>
        </div>
        <div className='container login-container'>
          <div className={'input input-username' + (errors.username || errors.api ? ' input-error' : '')}>
            <label className='input-label input-label-username' htmlFor='question'>Username</label>
            <input
              className='input-field input-field-username'
              type='text'
              id='username'
              name='username'
              ref='username'
              value={username}
              onChange={this.handleChange} />
            <span className='input-error-label'>{errors.username}</span>
          </div>
          <div className={'input input-password' + (errors.username || errors.api ? ' input-error' : '')}>
            <label className='input-label input-label-password' htmlFor='question'>Password</label>
            <input
              className='input-field input-field-password'
              type='password'
              id='password'
              name='password'
              ref='password'
              value={password}
              onKeyDown={this.handleKeyPress}
              onChange={this.handleChange} />
            <span className='input-error-label'>{errors.password || errors.api}</span>
          </div>
          <Button
            className='pull-right btn--small'
            text='Login'
            disabled={!isEmpty(errors)}
            callback={this.submit}
            submitEvent='login-submit' />
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  postLogin  : PropTypes.func.isRequired,
  hasUser    : PropTypes.bool.isRequired,
  setLoading : PropTypes.func.isRequired,
  cookies    : PropTypes.instanceOf(Cookies).isRequired,
}

const mapStateToProps = (state) => ({
  hasUser : hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  postLogin  : (username, password) => dispatch(postLogin(username, password)),
  setLoading : (value) => dispatch(setLoading(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Login))

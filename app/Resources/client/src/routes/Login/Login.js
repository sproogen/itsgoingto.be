import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEmpty, dissoc } from 'ramda'
import { postLogin } from 'store/api'
import Button from 'components/Button'
import './Login.scss'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data : {
        username : '',
        password : '',
      },
      errors : { },
    }
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
    let errors = this.state.errors

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

  submit = () => {
    const { data : { username, password }, errors } = this.state
    const { postLogin } = this.props

    if (this.validate()) {
      console.log('Login', username, password)
      postLogin(username, password)
    }
    return Promise.resolve()
  }

  render () {
    const { data : { username, password }, errors } = this.state

    return (
      <div>
        <div className='container header-container'>
          <div className='header center-text'>
            <h1>Login</h1>
          </div>
        </div>
        <div className='container login-container'>
          <div className='input input-username'>
            <label className='input-label input-label-username' htmlFor='question'>Username</label>
            <input
              className='input-field input-field-username'
              type='text'
              id='username'
              name='username'
              ref='username'
              value={username}
              onChange={this.handleChange} />
              <span>{errors.username}</span>
          </div>
          <div className='input input-password'>
            <label className='input-label input-label-password' htmlFor='question'>Password</label>
            <input
              className='input-field input-field-password'
              type='password'
              id='password'
              name='password'
              ref='password'
              value={password}
              onChange={this.handleChange} />
              <span>{errors.password}</span>
          </div>
          <Button className='pull-right' text='Login' disabled={!isEmpty(errors)} callback={this.submit} />
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  postLogin : PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  postLogin : (username, password) => dispatch(postLogin(username, password))
})

export default connect(null, mapDispatchToProps)(Login)

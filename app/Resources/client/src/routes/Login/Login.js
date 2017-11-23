import React from 'react'
import { isEmpty, merge } from 'ramda'
import Button from 'components/Button'
import './Login.scss'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: {
        username: '',
        password: '',
      },
      errors: { },
    }
  }

  handleChange = ({ target }) => {
    this.setState((prevState) => ({
      data: merge(prevState.data, { [target.id]: target.value }),
    }))
  }

  validate = () => {
    this.setState((prevState) => ({
      errors: merge(prevState.errors, { 'username': 'Please set a username' }),
    }))
    return false
  }

  submit = () => {
    const { data: { username, password }, errors } = this.state
    if (this.validate()) {
      console.log('Login', username, password)
    }
    return Promise.resolve()
  }

  render () {
    const { data: { username, password }, errors } = this.state

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
          </div>
          <Button className='pull-right' text='Login' disabled={!isEmpty(errors)} callback={this.submit} />
        </div>
      </div>
    )
  }
}

export default Login

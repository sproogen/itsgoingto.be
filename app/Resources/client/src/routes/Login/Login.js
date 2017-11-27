import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { withCookies, Cookies } from 'react-cookie'
import { isEmpty, dissoc } from 'ramda'
import { postLogin, APIError } from 'store/api'
import { hasUserSelector} from 'store/user'
import { setLoading } from 'store/loader'
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
      loading: false,
    }

    if (props.hasUser) {
      props.setLoading(true)
      this.state.loading = true
      browserHistory.push('/admin2') // TODO : Replace with 401 or home page
    }
  }

  componentWillMount = () => {
    const { setLoading } = this.props

    setLoading(false)
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
    const { postLogin, cookies, setLoading } = this.props

    if (this.validate()) {
      return postLogin(username, password).then((response) => {
        if (response instanceof APIError) {
          // TODO : Display error message to user
          return true
        } else {
          setLoading(true)
          cookies.set('itsgoingtobeUserToken', response.token, { path: '/', maxAge: 3600 })
          browserHistory.push('/admin2')
          return false
        }
      })
    } else {
      return Promise.resolve()
    }
  }

  render () {
    const { data : { username, password }, errors, loading } = this.state

    if (loading) return <div />

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
  postLogin  : PropTypes.func.isRequired,
  hasUser    : PropTypes.bool.isRequired,
  setLoading : PropTypes.func.isRequired,
  cookies    : PropTypes.instanceOf(Cookies).isRequired,
}

const mapStateToProps = (state, props) => ({
  hasUser : hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  postLogin  : (username, password) => dispatch(postLogin(username, password)),
  setLoading : (value) => dispatch(setLoading(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Login))

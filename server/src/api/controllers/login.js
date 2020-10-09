import {
  defaultTo, trim, isEmpty
} from 'ramda'
import { User } from '../../db'

const login = async (req, res) => {
  const username = trim(defaultTo('', req.body.username))
  const password = trim(defaultTo('', req.body.password))

  const errors = []

  if (username.length === 0) {
    errors.push('Username is required')
  }
  if (password.length === 0) {
    errors.push('Password is required')
  }

  if (!isEmpty(errors)) {
    return res.status(400).send({ errors })
  }

  return User.findOne({ username })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return res.status(400).send({ error: 'Invalid Username or Password' })
      }

      return res.json({
        token: user.generateJWT()
      })
    })
}

export default login

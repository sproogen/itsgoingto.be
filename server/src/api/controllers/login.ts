import { Request, Response } from 'express'
import {
  defaultTo, trim, isEmpty,
} from 'ramda'
import { User, validatePassword, generateJWT } from '../../db'

interface Body {
  username?: string
  password?: string
}

const login = async (req: Request<never, never, Body, never>, res: Response): Promise<Response> => {
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

  return User.findOne({ where: { username } })
    .then((user) => {
      if (!user || !validatePassword(user, password)) {
        return res.status(400).send({ errors: ['Invalid Username or Password'] })
      }

      return res.json({
        token: generateJWT(user),
      })
    })
}

export default login

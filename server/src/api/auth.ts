import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_PASSPHRASE = process.env.JWT_PASSPHRASE || ''

interface TokenInterface {
  username: string
}

const getTokenFromHeaders = (req: Request) => {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  }

  return null
}

const authRequired = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = getTokenFromHeaders(req)
  if (token === null) return res.status(401).send({ error: 'unauthorised' })

  return jwt.verify(token, JWT_PASSPHRASE, (err, data) => {
    if (err) return res.status(401).send({ error: 'forbidden' })
    req.user = (data as TokenInterface).username
    return next()
  })
}

const authOptional = (req: Request, _res: Response, next: NextFunction): void => {
  const token = getTokenFromHeaders(req)
  if (token === null) return next()

  return jwt.verify(token, JWT_PASSPHRASE, (err, data) => {
    if (err) return next()
    req.user = (data as TokenInterface).username
    return next()
  })
}

export { authRequired, authOptional }

import jwt from 'jsonwebtoken'

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  }

  return null
}

const authRequired = (req, res, next) => {
  const token = getTokenFromHeaders(req)
  if (token === null) return res.status(401).send({ error: 'unauthorised' })

  return jwt.verify(token, process.env.JWT_PASSPHRASE, (err, data) => {
    if (err) return res.status(401).send({ error: 'forbidden' })
    req.user = data.username
    return next()
  })
}

const authOptional = (req, res, next) => {
  const token = getTokenFromHeaders(req)
  if (token === null) return next()

  return jwt.verify(token, process.env.JWT_PASSPHRASE, (err, data) => {
    if (err) return next()
    req.user = data.username
    return next()
  })
}

export { authRequired, authOptional }

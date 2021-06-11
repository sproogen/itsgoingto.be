import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import server from '../server'

describe('Login API', () => {
  it('returns 400 for missing details', async () => {
    const response = await supertest(server).post('/api/login')
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toContain('Username is required')
    expect(response.body.errors).toContain('Password is required')
  })

  it('returns 400 for unknown user', async () => {
    const response = await supertest(server).post('/api/login').send({ username: 'john', password: 'password' })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toContain('Invalid Username or Password')
  })

  it('returns 400 for incorrect password', async () => {
    const response = await supertest(server).post('/api/login').send({ username: 'username', password: 'invalid' })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toContain('Invalid Username or Password')
  })

  it('returns JWT token for valid login details', async () => {
    const response = await supertest(server).post('/api/login').send({ username: 'username', password: 'password' })
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('token')
    const payload = jwt.verify(response.body.token, process.env.JWT_PASSPHRASE)
    expect(payload.username).toBe('username')
  })
})

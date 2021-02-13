import supertest from 'supertest'
import { User, Poll, Response } from '../src/db'
import app from '../src/app'

const validResponseFormat = (response) => {
  expect(Object.keys(response).sort()).toStrictEqual(['polls', 'responses'].sort())
  expect(response.polls).toEqual(expect.any(Number))
  expect(response.responses).toEqual(expect.any(Number))
}

describe('GET Stats API', () => {
  it('returns 401 unauthorised for no authentication', async () => {
    const response = await supertest(app).get('/api/stats')
    expect(response.statusCode).toEqual(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('unauthorised')
  })

  it('returns 401 forbidden for invalid authentication', async () => {
    const response = await supertest(app).get('/api/stats').auth('Invalid JWT Token', { type: 'bearer' })
    expect(response.statusCode).toEqual(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('forbidden')
  })

  it('returns total number of polls', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const pollsCount = await Poll.count()
    const response = await supertest(app)
      .get('/api/stats')
      .auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    validResponseFormat(response.body)
    expect(response.body.polls).toBe(pollsCount)
  })

  it('returns total number of responses', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const responseCount = await Response.count()
    const response = await supertest(app)
      .get('/api/stats')
      .auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    validResponseFormat(response.body)
    expect(response.body.responses).toBe(responseCount)
  })
})

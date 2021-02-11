import supertest from 'supertest'
import { User, Poll } from '../src/db'
import { matchesPollFormat } from './test-utils'
import app from '../src/app'

describe('DELETE Poll API', () => {
  it('returns 401 unauthorised for no authentication', async () => {
    const response = await supertest(app).delete('/api/polls/hs8Hgsi')
    expect(response.statusCode).toEqual(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('unauthorised')
  })

  it('returns 401 forbidden for invalid authentication', async () => {
    const response = await supertest(app).delete('/api/polls/hs8Hgsi').auth('Invalid JWT Token', { type: 'bearer' })
    expect(response.statusCode).toEqual(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('forbidden')
  })

  it('returns 404 when poll not found', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(app).delete('/api/polls/hs8Hgsi').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns 400 when poll already deleted', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(app).delete('/api/polls/d').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-already-deleted')
  })

  it('deleted and returns poll', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const poll = await Poll.findOne({
      where: {
        identifier: 'd',
      }
    })
    await poll.update({ deleted: false })

    const response = await supertest(app).delete('/api/polls/d').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body, false, false)
    expect(response.body.identifier).toBe('d')
    expect(response.body.question).toBe('This a deleted poll?')
    expect(response.body.deleted).toBe(true)
  })
})

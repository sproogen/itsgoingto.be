import supertest from 'supertest'
import { User, Poll, generateJWT } from '../db'
import { matchesPollFormat } from './test-utils'
import server from '../server'

describe('GET Poll API', () => {
  it('returns poll object', async () => {
    const response = await supertest(server).get('/api/polls/a')
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('a')
    expect(response.body.question).toBe('This is a question?')
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.responsesCount).toBe(3)
  })

  it('returns user responses with poll', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'a',
      },
      include: ['answers'],
    })
    const response = await supertest(server).get('/api/polls/a').set('Cookie', ['USERID=98djhfdjs098321dsafhf2309'])
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.userResponses.sort()).toEqual([poll.answers[0].id, poll.answers[1].id].sort())
  })

  it('updates ended value when fetching poll', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'c',
      },
    })
    await poll.update({ ended: false })

    const response = await supertest(server).get('/api/polls/c')
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('c')
    expect(response.body.question).toBe('This an ended poll?')
    expect(response.body.ended).toBe(true)
  })

  // TODO: Check doesn't update ended

  it('returns 404 when poll not found', async () => {
    const response = await supertest(server).get('/api/polls/hs8Hgsi')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns 403 for protected poll with no passphrase', async () => {
    const response = await supertest(server).get('/api/polls/b')
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('returns 403 for protected poll with incorrect passphrase', async () => {
    const response = await supertest(server).get('/api/polls/b').query({ passphrase: 'bad pass' })
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('returns protected poll with correct passphrase', async () => {
    const response = await supertest(server).get('/api/polls/b').query({ passphrase: 'abc' })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('b')
    expect(response.body.question).toBe('This a protected poll?')
  })

  it('returns protected poll for authenticated user', async () => {
    const user = await User.findOne({
      where: {
        username: 'username',
      },
    })
    const response = await supertest(server).get('/api/polls/b').auth(generateJWT(user), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('b')
    expect(response.body.question).toBe('This a protected poll?')
  })

  it('returns 404 for deleted poll', async () => {
    const response = await supertest(server).get('/api/polls/d')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns deleted poll for authenticated user', async () => {
    const user = await User.findOne({
      where: {
        username: 'username',
      },
    })
    const response = await supertest(server).get('/api/polls/d').auth(generateJWT(user), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('d')
    expect(response.body.question).toBe('This a deleted poll?')
  })
})

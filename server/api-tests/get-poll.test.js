import { all, is } from 'ramda'
import supertest from 'supertest'
import { User, Poll } from '../src/db'
import app from '../src/app'

const DATE_REGEX = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/

expect.extend({
  toBeISODateString(received) {
    if (received !== null && DATE_REGEX.test(received)) {
      return {
        message: () => `expected ${received} not to be an ISO 8601 date time formatted string`,
        pass: true
      }
    }
    return {
      message: () => `expected ${received} to be an ISO 8601 date time formatted string`,
      pass: false
    }
  },
  toBeISODateStringOrNull(received) {
    if (received === null || DATE_REGEX.test(received)) {
      return {
        message: () => `expected ${received} not to be an ISO 8601 date time formatted string`,
        pass: true
      }
    }
    return {
      message: () => `expected ${received} to be an ISO 8601 date time formatted string`,
      pass: false
    }
  },
  toBeArrayContainingNumbers(received) {
    if (Array.isArray(received) && all(is(Number), received)) {
      return {
        message: () => `expected ${received} not to be an array containing only numbers`,
        pass: true
      }
    }
    return {
      message: () => `expected ${received} to be an array containing only numbers`,
      pass: false
    }
  }
})

const matchesPollFormat = (poll) => {
  expect(Object.keys(poll)).toStrictEqual([
    'id', 'identifier', 'question', 'multipleChoice', 'endDate', 'ended',
    'deleted', 'created', 'updated', 'answers', 'userResponses', 'responsesCount'
  ])
  expect(poll.id).toEqual(expect.any(Number))
  expect(poll.identifier).toEqual(expect.any(String))
  expect(poll.question).toEqual(expect.any(String))
  expect(poll.multipleChoice).toEqual(expect.any(Boolean))
  expect(poll.endDate).toBeISODateStringOrNull()
  expect(poll.ended).toEqual(expect.any(Boolean))
  expect(poll.deleted).toEqual(expect.any(Boolean))
  expect(poll.created).toBeISODateString()
  expect(poll.updated).toBeISODateString()
  expect(Array.isArray(poll.answers)).toBe(true)
  poll.answers.forEach((answer) => {
    expect(Object.keys(answer)).toStrictEqual(['id', 'answer', 'responsesCount'])
    expect(answer.id).toEqual(expect.any(Number))
    expect(answer.answer).toEqual(expect.any(String))
    expect(answer.responsesCount).toEqual(expect.any(Number))
  })
  expect(poll.userResponses).toBeArrayContainingNumbers()
  expect(poll.responsesCount).toEqual(expect.any(Number))
}

describe('Poll API', () => {
  it('returns poll object', async () => {
    const response = await supertest(app).get('/api/polls/a')
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('a')
    expect(response.body.question).toBe('This is a question?')
  })

  // it('returns user responses for user', async () => {

  it('updates ended value when fetching poll', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'c',
      }
    })
    await poll.update({ ended: false })

    const response = await supertest(app).get('/api/polls/c')
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('c')
    expect(response.body.question).toBe('This an ended poll?')
    expect(response.body.ended).toBe(true)
  })

  it('returns 404 when poll not found', async () => {
    const response = await supertest(app).get('/api/polls/hs8Hgsi')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns 403 for protected poll with no passphrase', async () => {
    const response = await supertest(app).get('/api/polls/b')
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('returns 403 for protected poll with incorrect passphrase', async () => {
    const response = await supertest(app).get('/api/polls/b').query({ passphrase: 'bad pass' })
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('returns protected poll with correct passphrase', async () => {
    const response = await supertest(app).get('/api/polls/b').query({ passphrase: 'abc' })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('b')
    expect(response.body.question).toBe('This a protected poll?')
  })

  it('returns protected poll for authenticated user', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(app).get('/api/polls/b').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('b')
    expect(response.body.question).toBe('This a protected poll?')
  })

  it('returns 404 for deleted poll', async () => {
    const response = await supertest(app).get('/api/polls/d')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns deleted poll for authenticated user', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(app).get('/api/polls/d').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.identifier).toBe('d')
    expect(response.body.question).toBe('This a deleted poll?')
  })
})

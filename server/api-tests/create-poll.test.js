import supertest from 'supertest'
import { Poll } from '../src/db'
import { matchesPollFormat } from './test-utils'
import app from '../src/app'

describe('CREATE Poll API', () => {
  it('returns 400 for missing question', async () => {
    const response = await supertest(app)
      .post('/api/polls')
      .send({ answers: ['Answer A'] })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toContain('No question has been provided')
  })

  it('returns 400 for missing answers', async () => {
    const response = await supertest(app)
      .post('/api/polls')
      .send({ question: 'Question?' })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toContain('No answers have been provided')
  })

  it('returns 400 for invalid end date format', async () => {
    const response = await supertest(app)
      .post('/api/polls')
      .send({ question: 'Question', answers: ['Answer A'], endDate: 'invalidDateString' })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toContain('Invalid end date format')
  })

  it('creates and returns a poll with valid data', async () => {
    const date = new Date().toISOString()
    const response = await supertest(app)
      .post('/api/polls')
      .send({
        question: 'Question', answers: ['Answer A'], endDate: date, multipleChoice: true
      })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.question).toBe('Question')
    expect(response.body.answers).toHaveLength(1)
    expect(response.body.answers[0].answer).toBe('Answer A')
    expect(response.body.endDate).toBe(date)
    expect(response.body.multipleChoice).toBe(true)
  })

  it('create poll with passphrase', async () => {
    const response = await supertest(app)
      .post('/api/polls')
      .send({
        question: 'Question 2', answers: ['Answer B'], passphrase: 'pass'
      })
    expect(response.statusCode).toEqual(200)
    matchesPollFormat(response.body)
    expect(response.body.question).toBe('Question 2')
    expect(response.body.answers).toHaveLength(1)
    expect(response.body.answers[0].answer).toBe('Answer B')

    const poll = await Poll.findOne({
      where: {
        id: response.body.id,
      }
    })
    expect(poll.passphrase).toBe('pass')
  })
})

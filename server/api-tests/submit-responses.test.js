import supertest from 'supertest'
import { User, Poll } from '../src/db'
import { matchesResponsesFormat } from './test-utils'
import server from '../src/server'

describe('Submit Responses API', () => {
  it('returns 404 when poll not found', async () => {
    const response = await supertest(server).post('/api/polls/hs8Hgsi/responses')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns 404 for deleted poll', async () => {
    const response = await supertest(server).post('/api/polls/d/responses')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns 404 for deleted poll for authenticated user', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server).post('/api/polls/d/responses').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns 403 for protected poll with no passphrase', async () => {
    const response = await supertest(server).post('/api/polls/b/responses')
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('returns 403 for protected poll with incorrect passphrase', async () => {
    const response = await supertest(server).post('/api/polls/b/responses').query({ passphrase: 'bad pass' })
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('saves response and returns poll object with correct passphrase', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'b',
      },
      include: ['answers']
    })

    const response = await supertest(server)
      .post('/api/polls/b/responses')
      .set('Cookie', ['USERID=sdfsdfg43tdgfdfgdf'])
      .query({ passphrase: 'abc' })
      .send({ answers: [poll.answers[0].id] })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.responsesCount).toBe(1)
    expect(response.body.answers[0].responsesCount).toBe(1)
    expect(response.body.answers[1].responsesCount).toBe(0)
    expect(response.body.userResponses).toHaveLength(1)
    expect(response.body.userResponses).toContain(poll.answers[0].id)
  })

  it('returns 400 for ended poll', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'c',
      }
    })
    await poll.update({ ended: true })

    const response = await supertest(server).post('/api/polls/c/responses')
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-ended')
  })

  // TODO : This doesn't work
  // it('updates ended value when submitting responses for poll', async () => {
  //   const poll = await Poll.findOne({
  //     where: {
  //       identifier: '3',
  //     },
  //     include: ['answers']
  //   })
  //   await poll.update({ ended: false })

  //   const response = await supertest(server)
  //     .post('/api/polls/e/responses')
  //     .set('Cookie', ['USERID=456fghfdghdfgh'])
  //     .send({ answers: [poll.answers[0].id] })

  //   expect(response.statusCode).toEqual(200)
  //   matchesResponsesFormat(response.body)
  //   expect(response.body.ended).toBe(true)
  //   expect(response.body.answers).toHaveLength(3)
  //   expect(response.body.responsesCount).toBe(1)
  // })

  it('returns 400 when no answers provided', async () => {
    const response = await supertest(server)
      .post('/api/polls/e/responses')
      .set('Cookie', ['USERID=sdfsdfg43tdgfdfgdf'])
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors).toContain('No answers have been provided')
  })

  it('returns 400 when no USERID provided', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'e',
      },
      include: ['answers']
    })

    const response = await supertest(server)
      .post('/api/polls/e/responses')
      .send({ answers: [poll.answers[0].id] })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('errors')
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors).toContain('USERID is required')
  })

  it('saves response and returns poll object', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'e',
      },
      include: ['answers']
    })

    const response = await supertest(server)
      .post('/api/polls/e/responses')
      .set('Cookie', ['USERID=sdfsdfg43tdgfdfgdf'])
      .send({ answers: [poll.answers[0].id] })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.responsesCount).toBe(1)
    expect(response.body.answers[0].responsesCount).toBe(1)
    expect(response.body.answers[1].responsesCount).toBe(0)
    expect(response.body.userResponses).toHaveLength(1)
    expect(response.body.userResponses).toContain(poll.answers[0].id)
  })

  it('saves changed response and returns poll object', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'e',
      },
      include: ['answers']
    })

    const response = await supertest(server)
      .post('/api/polls/e/responses')
      .set('Cookie', ['USERID=sdfsdfg43tdgfdfgdf'])
      .send({ answers: [poll.answers[1].id] })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.responsesCount).toBe(1)
    expect(response.body.answers[0].responsesCount).toBe(0)
    expect(response.body.answers[1].responsesCount).toBe(1)
    expect(response.body.userResponses).toHaveLength(1)
    expect(response.body.userResponses).toContain(poll.answers[1].id)
  })

  it('saves multiple choice responses and returns poll object', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'f',
      },
      include: ['answers']
    })

    const response = await supertest(server)
      .post('/api/polls/f/responses')
      .set('Cookie', ['USERID=sdfsdfg43tdgfdfgdf'])
      .send({ answers: [poll.answers[0].id, poll.answers[1].id] })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.responsesCount).toBe(2)
    expect(response.body.answers[0].responsesCount).toBe(1)
    expect(response.body.answers[1].responsesCount).toBe(1)
    expect(response.body.userResponses).toHaveLength(2)
    expect(response.body.userResponses).toContain(poll.answers[0].id)
    expect(response.body.userResponses).toContain(poll.answers[1].id)
  })

  it('saves changed multiple choice responses and returns poll object', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'f',
      },
      include: ['answers']
    })

    const response = await supertest(server)
      .post('/api/polls/f/responses')
      .set('Cookie', ['USERID=sdfsdfg43tdgfdfgdf'])
      .send({ answers: [poll.answers[0].id, poll.answers[2].id] })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.responsesCount).toBe(2)
    expect(response.body.answers[0].responsesCount).toBe(1)
    expect(response.body.answers[1].responsesCount).toBe(0)
    expect(response.body.answers[2].responsesCount).toBe(1)
    expect(response.body.userResponses).toHaveLength(2)
    expect(response.body.userResponses).toContain(poll.answers[0].id)
    expect(response.body.userResponses).toContain(poll.answers[2].id)
  })

  it('saves no multiple choice responses and returns poll object', async () => {
    const response = await supertest(server)
      .post('/api/polls/f/responses')
      .set('Cookie', ['USERID=sdfsdfg43tdgfdfgdf'])
      .send({ answers: [] })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.responsesCount).toBe(0)
    expect(response.body.answers[0].responsesCount).toBe(0)
    expect(response.body.answers[1].responsesCount).toBe(0)
    expect(response.body.answers[2].responsesCount).toBe(0)
    expect(response.body.userResponses).toHaveLength(0)
  })

  // TODO: Test send responses to socket server
})

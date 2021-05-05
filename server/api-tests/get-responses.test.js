import supertest from 'supertest'
import { User, Poll } from '../src/db'
import { matchesResponsesFormat } from './test-utils'
import server from '../src/server'

describe('GET Responses API', () => {
  it('returns responses for poll', async () => {
    const response = await supertest(server).get('/api/polls/a/responses')
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.answers[0].responsesCount).toBe(1)
    expect(response.body.responsesCount).toBe(3)
  })

  it('returns user responses for poll', async () => {
    const poll = await Poll.findOne({
      where: {
        identifier: 'a',
      },
      include: ['answers']
    })
    const response = await supertest(server)
      .get('/api/polls/a/responses')
      .set('Cookie', ['USERID=98djhfdjs098321dsafhf2309'])
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.userResponses.sort()).toEqual([poll.answers[0].id, poll.answers[1].id].sort())
  })

  // TODO : This doesn't work
  // it('updates ended value when fetching responses for poll', async () => {
  //   const poll = await Poll.findOne({
  //     where: {
  //       identifier: 'c',
  //     }
  //   })
  //   await poll.update({ ended: false })

  //   const response = await supertest(server).get('/api/polls/c/responses')
  //   console.log(response.body)
  //   expect(response.statusCode).toEqual(200)
  //   expect(response.body.ended).toBe(true)
  // })

  it('returns 404 when poll not found', async () => {
    const response = await supertest(server).get('/api/polls/hs8Hgsi/responses')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns 403 for protected poll with no passphrase', async () => {
    const response = await supertest(server).get('/api/polls/b/responses')
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('returns 403 for protected poll with incorrect passphrase', async () => {
    const response = await supertest(server).get('/api/polls/b/responses').query({ passphrase: 'bad pass' })
    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('incorrect-passphrase')
  })

  it('returns responses for protected poll with correct passphrase', async () => {
    const response = await supertest(server).get('/api/polls/b/responses').query({ passphrase: 'abc' })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
  })

  it('returns responses for protected poll for authenticated user', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server).get('/api/polls/b/responses').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
  })

  it('returns 404 for deleted poll', async () => {
    const response = await supertest(server).get('/api/polls/d/responses')
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('poll-not-found')
  })

  it('returns responses for deleted poll for authenticated user', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server).get('/api/polls/d/responses').auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    matchesResponsesFormat(response.body)
    expect(response.body.answers).toHaveLength(3)
    expect(response.body.answers[0].responsesCount).toBe(0)
    expect(response.body.responsesCount).toBe(0)
  })
})

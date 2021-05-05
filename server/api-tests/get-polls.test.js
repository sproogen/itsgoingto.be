import supertest from 'supertest'
import { User } from '../src/db'
import { matchesPollFormat } from './test-utils'
import server from '../src/server'

const validResponseFormat = (response) => {
  expect(Object.keys(response).sort()).toStrictEqual(['count', 'total', 'entities'].sort())
  expect(response.count).toEqual(expect.any(Number))
  expect(response.total).toEqual(expect.any(Number))
  expect(Array.isArray(response.entities)).toBe(true)
  response.entities.forEach((entity) => matchesPollFormat(entity, false, false))
}

describe('GET Polls API', () => {
  it('returns 401 unauthorised for no authentication', async () => {
    const response = await supertest(server).get('/api/polls')
    expect(response.statusCode).toEqual(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('unauthorised')
  })

  it('returns 401 forbidden for invalid authentication', async () => {
    const response = await supertest(server).get('/api/polls').auth('Invalid JWT Token', { type: 'bearer' })
    expect(response.statusCode).toEqual(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('forbidden')
  })

  it('returns 400 for invalid sort option', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server)
      .get('/api/polls')
      .auth(user.generateJWT(), { type: 'bearer' })
      .query({ sort: 'bad option' })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('invalid-sort-option')
  })

  it('returns 400 for invalid sort direction', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server)
      .get('/api/polls')
      .auth(user.generateJWT(), { type: 'bearer' })
      .query({ sortDirection: 'bad direction' })
    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('invalid-sort-direction')
  })

  it('returns valid polls response', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server)
      .get('/api/polls')
      .auth(user.generateJWT(), { type: 'bearer' })
    expect(response.statusCode).toEqual(200)
    validResponseFormat(response.body)
  })

  // TODO: Add more polls to test this.
  // it('returns default page size number of polls', async () => {
  //   const user = await User.findOne({
  //     where: {
  //       username: 'username'
  //     }
  //   })
  //   const response = await supertest(server)
  //     .get('/api/polls')
  //     .auth(user.generateJWT(), { type: 'bearer' })
  //     .query({ pageSize: '3' })
  //   expect(response.statusCode).toEqual(200)
  //   validResponseFormat(response.body)
  //   expect(response.body.entities).toHaveLength(10)
  // })

  it('returns page size number of polls', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server)
      .get('/api/polls')
      .auth(user.generateJWT(), { type: 'bearer' })
      .query({ pageSize: '3' })
    expect(response.statusCode).toEqual(200)
    validResponseFormat(response.body)
    expect(response.body.entities).toHaveLength(3)
  })

  it('returns polls using default page', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server)
      .get('/api/polls')
      .auth(user.generateJWT(), { type: 'bearer' })
      .query({
        pageSize: '3', sort: 'id', sortDirection: 'asc'
      })
    expect(response.statusCode).toEqual(200)
    validResponseFormat(response.body)
    expect(response.body.entities[0].id).toBe(1)
  })

  it('returns polls for correct page', async () => {
    const user = await User.findOne({
      where: {
        username: 'username'
      }
    })
    const response = await supertest(server)
      .get('/api/polls')
      .auth(user.generateJWT(), { type: 'bearer' })
      .query({
        pageSize: '3', page: 2, sort: 'id', sortDirection: 'asc'
      })
    expect(response.statusCode).toEqual(200)
    validResponseFormat(response.body)
    expect(response.body.entities[0].id).toBe(4)
  })

  // TODO: Test total is correct number
  // TODO: Test default sort option
  // TODO: Test default sort direction
  // TODO: Test all sort options and directions
  // TODO: Test upated ended
})

/* global expect, jest */
import moment from 'moment'
import {
  ROUTE_POLL,
  ROUTE_RESPONSES,
  ROUTE_LOGIN,
  ROUTE_STATS,
  extractResponse,
  getEndDateFromPoll,
  APIError,
  onError,
  postPoll,
  fetchPoll,
  deletePoll,
  fetchPolls,
  postResponse,
  fetchResponses,
  postLogin,
  fetchStats,
} from 'store/api'
import { userTokenSelector } from 'store/user/selectors' // eslint-disable-line
import { updateUser } from 'store/user/actions'
import { updateStats } from 'store/stats/actions'
import { updatePoll, updateResponses, setPolls, setPollPage, setPollCount } from 'store/poll/actions'
import { POLLS_PER_PAGE } from 'store/poll'

jest.mock('store/user/selectors')
jest.mock('store/user/actions')
jest.mock('store/stats/actions')
jest.mock('store/poll/actions')

const jsonOk = (body) => {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  })

  return Promise.resolve(mockResponse)
}

const jsonError = (status, body) => {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-type': 'application/json'
    }
  })

  return Promise.resolve(mockResponse)
}

describe('(Store) API', () => {
  it('Should export a constant ROUTE_POLL.', () => {
    expect(ROUTE_POLL).toBe('/api/polls')
  })

  it('Should export a constant ROUTE_RESPONSES.', () => {
    expect(ROUTE_RESPONSES).toBe('/responses')
  })

  it('Should export a constant ROUTE_LOGIN.', () => {
    expect(ROUTE_LOGIN).toBe('/api/login')
  })

  it('Should export a constant ROUTE_STATS.', () => {
    expect(ROUTE_STATS).toBe('/api/stats')
  })

  describe('(Helpers)', () => {
    describe('(Helper) extractResponse', () => {
      it('Should be a function.', () => {
        expect(typeof extractResponse).toBe('function')
      })
    })

    describe('(Helper) onError', () => {
      it('Should be a function.', () => {
        expect(typeof onError).toBe('function')
      })
    })

    describe('(Helper) getEndDateFromPoll', () => {
      let poll

      beforeEach(function () {
        poll = { question: 'Question', identifier: '', endType: null }
      })

      it('Should be a function.', () => {
        expect(typeof getEndDateFromPoll).toBe('function')
      })

      it('Should return null when endType is null.', () => {
        expect(getEndDateFromPoll(poll)).toBe(null)
      })

      it('Should return null when endType is endNever.', () => {
        poll.endType = 'endNever'
        expect(getEndDateFromPoll(poll)).toBe(null)
      })

      it('Should return a date string when endType is endAt.', () => {
        poll.endType = 'endAt'
        poll.endAt = moment()
        expect(getEndDateFromPoll(poll)).toBe(poll.endAt.format('YYYY-MM-DDTHH:mm:ssZ'))
      })

      it('Should return a date string when endType is endIn.', () => {
        poll.endType = 'endIn'
        poll.endIn = 5
        expect(getEndDateFromPoll(poll)).toBe(
          moment()
            .add(poll.endIn, 'hours')
            .seconds(0)
            .milliseconds(0)
            .format('YYYY-MM-DDTHH:mm:ssZ')
        )
      })
    })
  })

  describe('(API Calls)', () => {
    let _globalState
    let _dispatch
    let _getState

    beforeEach(() => {
      window.fetch = jest.fn(() => jsonOk({}))

      _globalState = {
        poll    : {
          polls : [{ question: 'Question', identifier: '', multipleChoice: false, passphrase: '' }],
          page  : null,
          count : 0
        },
        answers : ['Answer'],
        user    : {},
      }
      _dispatch = jest.fn((action) => {
        if (typeof action === 'function') {
          return action(_dispatch, _getState)
        } else {
          return action
        }
      })
      _getState = jest.fn(() => _globalState)

      userTokenSelector.mockImplementation(() => 'USERTOKEN')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(API Call) postPoll', () => {
      it('Should be exported as a function.', () => {
        expect(typeof postPoll).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof postPoll()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return postPoll()(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url and data.', () => {
        return postPoll()(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL,
            {
              method      : 'POST',
              credentials : 'same-origin',
              body        : '{"question":"Question","answers":["Answer"],' +
                            '"multipleChoice":false,"passphrase":"","endDate":null}'
            }
          )
        })
      })

      it('Should return a promise with the response.', () => {
        window.fetch = jest.fn(() => jsonOk({}))
        updatePoll.mockImplementation(() => ({ question: 'Question', identifier: 'hf0sd8fhoas' }))
        return postPoll()(_dispatch, _getState).then((response) => {
          expect(response).toEqual({ question: 'Question', identifier: 'hf0sd8fhoas' })
        })
      })

      it('Should catch error.', () => {
        window.fetch = jest.fn(() => jsonError(404, {
          message: 'There was an error'
        }))
        return postPoll()(_dispatch, _getState).then((response) => {
          expect(response).toBeInstanceOf(APIError)
          expect(response.name).toBe('APIError')
          expect(response.details.status).toBe(404)
        })
      })

      it('Should dispatch updatePoll().', () => {
        window.fetch = jest.fn(() => jsonOk({
          question: 'Question', identifier: 'hf0sd8fhoas'
        }))
        updatePoll.mockImplementation(() => ({}))

        return postPoll()(_dispatch, _getState).then(() => {
          expect(updatePoll).toHaveBeenCalledTimes(1)
          expect(updatePoll).toHaveBeenCalledWith({ question: 'Question', identifier: 'hf0sd8fhoas' })
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          updatePoll.mockRestore()
        })
      })
    })

    describe('(API Call) fetchPoll', () => {
      it('Should be exported as a function.', () => {
        expect(typeof fetchPoll).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof fetchPoll()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return fetchPoll('hf0sd8fhoas')(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url.', () => {
        return fetchPoll('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas',
            { credentials: 'same-origin', headers: { Authorization: 'Bearer USERTOKEN' } }
          )
        })
      })

      it('Should call fetch with the passphrase.', () => {
        _globalState.poll.polls = [{
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          multipleChoice : false,
          passphrase     : '1234'
        }]

        return fetchPoll('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas?passphrase=1234',
            { credentials: 'same-origin', headers: { Authorization: 'Bearer USERTOKEN' } }
          )
        })
      })

      it('Should return a promise with the response.', () => {
        window.fetch = jest.fn(() => jsonOk({}))
        updatePoll.mockImplementation(() => ({ question: 'Question', identifier: 'hf0sd8fhoas' }))
        return fetchPoll('hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(response).toEqual({ question: 'Question', identifier: 'hf0sd8fhoas' })
        })
      })

      it('Should catch error.', () => {
        window.fetch = jest.fn(() => jsonError(404, {
          message: 'There was an error'
        }))
        return fetchPoll('hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(response).toBeInstanceOf(APIError)
          expect(response.name).toBe('APIError')
          expect(response.details.status).toBe(404)
        })
      })

      it('Should dispatch updatePoll().', () => {
        window.fetch = jest.fn(() => jsonOk({
          question: 'Question', identifier: 'hf0sd8fhoas'
        }))
        updatePoll.mockImplementation(() => ({}))

        return fetchPoll('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(updatePoll).toHaveBeenCalledTimes(1)
          expect(updatePoll).toHaveBeenCalledWith({ question: 'Question', identifier: 'hf0sd8fhoas' })
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          updatePoll.mockRestore()
        })
      })
    })

    describe('(API Call) deletePoll', () => {
      it('Should be exported as a function.', () => {
        expect(typeof deletePoll).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof deletePoll()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return deletePoll('hf0sd8fhoas')(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url and data.', () => {
        return deletePoll('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas',
            { method: 'DELETE', credentials: 'same-origin', headers: { Authorization: 'Bearer USERTOKEN' } }
          )
        })
      })

      it('Should return a promise with the response.', () => {
        window.fetch = jest.fn(() => jsonOk({}))
        updatePoll.mockImplementation(() => ({ question: 'Question', identifier: 'hf0sd8fhoas', deleted: true }))
        return deletePoll('hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(response).toEqual({ question: 'Question', identifier: 'hf0sd8fhoas', deleted: true })
        })
      })

      it('Should catch error.', () => {
        window.fetch = jest.fn(() => jsonError(404, { message: 'There was an error' }))
        return deletePoll('hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(response).toBeInstanceOf(APIError)
          expect(response.name).toBe('APIError')
          expect(response.details.status).toBe(404)
        })
      })

      it('Should dispatch updatePoll().', () => {
        window.fetch = jest.fn(() => jsonOk({
          question: 'Question', identifier: 'hf0sd8fhoas', deleted: true
        }))
        updatePoll.mockImplementation(() => ({}))

        return deletePoll('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(updatePoll).toHaveBeenCalledTimes(1)
          expect(updatePoll).toHaveBeenCalledWith(
            { question: 'Question', identifier: 'hf0sd8fhoas', deleted: true }
          )
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          updatePoll.mockRestore()
        })
      })
    })

    describe('(API Call) fetchPolls', () => {
      it('Should be exported as a function.', () => {
        expect(typeof fetchPolls).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof fetchPolls()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return fetchPolls()(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url.', () => {
        return fetchPolls(1)(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '?page=1&pageSize=' + POLLS_PER_PAGE,
            { credentials: 'same-origin', headers: { Authorization: 'Bearer USERTOKEN' } }
          )
        })
      })

      it('Should dispatch setPolls().', () => {
        window.fetch = jest.fn(() => jsonOk({
          entities: [{ question: 'Question', identifier: 'hf0sd8fhoas' }]
        }))
        setPolls.mockImplementation(() => ({}))

        return fetchPolls(1)(_dispatch, _getState).then(() => {
          expect(setPolls).toHaveBeenCalledTimes(1)
          expect(setPolls).toHaveBeenCalledWith([{ question: 'Question', identifier: 'hf0sd8fhoas' }])
          expect(_dispatch).toHaveBeenCalledWith({})

          setPolls.mockRestore()
        })
      })

      it('Should dispatch setPollPage().', () => {
        setPollPage.mockImplementation(() => ({}))

        return fetchPolls(1)(_dispatch, _getState).then(() => {
          expect(setPollPage).toHaveBeenCalledTimes(1)
          expect(setPollPage).toHaveBeenCalledWith(0)
          expect(_dispatch).toHaveBeenCalledWith({})

          setPollPage.mockRestore()
        })
      })

      it('Should dispatch setPollCount().', () => {
        window.fetch = jest.fn(() => jsonOk({
          total: 5
        }))
        setPollCount.mockImplementation(() => ({}))

        return fetchPolls(1)(_dispatch, _getState).then(() => {
          expect(setPollCount).toHaveBeenCalledTimes(1)
          expect(setPollCount).toHaveBeenCalledWith(5)
          expect(_dispatch).toHaveBeenCalledWith({})

          setPollCount.mockRestore()
        })
      })
    })

    describe('(API Call) postResponse', () => {
      it('Should be exported as a function.', () => {
        expect(typeof postResponse).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof postResponse()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return postResponse()(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should return a promise with the response.', () => {
        updateResponses.mockImplementation(() => ({}))

        return postResponse(434, 'hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(response).toEqual({})
        })
      })

      it('Should catch error.', () => {
        window.fetch = jest.fn(() => jsonError(404, { message: 'There was an error' }))
        return postResponse()(_dispatch, _getState).then((response) => {
          expect(response).toBeInstanceOf(APIError)
          expect(response.name).toBe('APIError')
          expect(response.details.status).toBe(404)
        })
      })

      it('Should call fetch with the correct url and data.', () => {
        return postResponse(434, 'hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[434]}' })
        })
      })

      it('Should call fetch with the correct url and data with passphrase.', () => {
        _globalState.poll.polls = [{
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          multipleChoice : false,
          passphrase     : '1234'
        }]

        return postResponse(434, 'hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[434],"passphrase":"1234"}' })
        })
      })

      it('Should call fetch with the correct data for multiple choice initial answer.', () => {
        _globalState = {
          poll    : {
            polls : [{
              question       : 'Question',
              identifier     : 'hf0sd8fhoas',
              multipleChoice : true,
              userResponses  : []
            }],
            page  : null,
            count : 0
          },
          answers : ['Answer']
        }
        return postResponse(434, 'hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[434]}' })
        })
      })

      it('Should call fetch with the correct data for multiple choice add answer.', () => {
        _globalState = {
          poll    : {
            polls : [{
              question       : 'Question',
              identifier     : 'hf0sd8fhoas',
              multipleChoice : true,
              userResponses  : [433]
            }],
            page  : null,
            count : 0
          },
          answers : ['Answer']
        }
        return postResponse(434, 'hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[433,434]}' })
        })
      })

      it('Should call fetch with the correct data for multiple choice remove answer.', () => {
        _globalState = {
          poll    : {
            polls : [{
              question       : 'Question',
              identifier     : 'hf0sd8fhoas',
              multipleChoice : true,
              userResponses  : [433]
            }],
            page  : null,
            count : 0
          },
          answers : ['Answer']
        }
        // _getStateSpy = sinon.spy(() => {
        //   return _globalState
        // })
        return postResponse(433, 'hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[]}' })
        })
      })
    })

    describe('(API Call) fetchResponses', () => {
      it('Should be exported as a function.', () => {
        expect(typeof fetchResponses).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof fetchResponses()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return fetchResponses()(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url and data.', () => {
        return fetchResponses('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { credentials: 'same-origin' })
        })
      })

      it('Should call fetch with the passphrase.', () => {
        _globalState.poll.polls = [{
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          multipleChoice : false,
          passphrase     : '1234'
        }]

        return fetchResponses('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES + '?passphrase=1234',
            { credentials: 'same-origin' })
        })
      })

      it('Should return a promise with the response.', () => {
        updateResponses.mockImplementation(() => ({}))

        return fetchResponses('hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(response).toEqual({})
        })
      })

      it('Should catch error.', () => {
        window.fetch = jest.fn(() => jsonError(404, { message: 'There was an error' }))
        return fetchResponses()(_dispatch, _getState).then((response) => {
          expect(response).toBeInstanceOf(APIError)
          expect(response.name).toBe('APIError')
          expect(response.details.status).toBe(404)
        })
      })

      it('Should dispatch updateResponses().', () => {
        window.fetch = jest.fn(() => jsonOk({ responses: [] }))
        updateResponses.mockImplementation(() => ({}))

        return fetchResponses('hf0sd8fhoas')(_dispatch, _getState).then(() => {
          expect(updateResponses).toHaveBeenCalledTimes(1)
          expect(updateResponses).toHaveBeenCalledWith({ responses: [] }, 'hf0sd8fhoas')
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          updateResponses.mockRestore()
        })
      })
    })

    describe('(API Call) postLogin', () => {
      it('Should be exported as a function.', () => {
        expect(typeof postLogin).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof postLogin()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return postLogin()(_dispatch).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url and data.', () => {
        return postLogin('username', 'password')(_dispatch).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_LOGIN,
            {
              method      : 'POST',
              credentials : 'same-origin',
              body        : '{"username":"username","password":"password"}'
            }
          )
        })
      })

      it('Should return a promise with the response.', () => {
        updateUser.mockImplementation(() => ({ user: { username: 'username', token: 'js7XZ&$£ZZSSu2389' } }))

        return postLogin('username', 'password')(_dispatch).then((response) => {
          expect(response).toEqual({ username: 'username', token: 'js7XZ&$£ZZSSu2389' })
        })
      })

      it('Should catch error.', () => {
        window.fetch = jest.fn(() => jsonError(400, { message: 'There password is incorrect' }))

        return postLogin('username', 'wrongpassword')(_dispatch).then((response) => {
          expect(response).toBeInstanceOf(APIError)
          expect(response.name).toBe('APIError')
          expect(response.details.status).toBe(400)
        })
      })

      it('Should dispatch updateUser().', () => {
        window.fetch = jest.fn(() => jsonOk({ username: 'username', token: 'js7XZ&$£ZZSSu2389' }))
        updateUser.mockImplementation(() => ({}))

        return postLogin('username', 'password')(_dispatch).then(() => {
          expect(updateUser).toHaveBeenCalledTimes(1)
          expect(updateUser).toHaveBeenCalledWith({ username: 'username', token: 'js7XZ&$£ZZSSu2389' })
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          updateUser.mockRestore()
        })
      })
    })

    describe('(API Call) fetchStats', () => {
      it('Should be exported as a function.', () => {
        expect(typeof fetchStats).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof fetchStats()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return fetchStats()(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url.', () => {
        return fetchStats()(_dispatch, _getState).then(() => {
          expect(window.fetch).toHaveBeenCalledTimes(1)
          expect(window.fetch).toHaveBeenCalledWith(
            ROUTE_STATS,
            { credentials: 'same-origin', headers: { Authorization: 'Bearer USERTOKEN' } }
          )
        })
      })

      it('Should return a promise with the response fetchStats.', () => {
        updateStats.mockImplementation(() => ({ stats: { polls: 523, responses: 1385 } }))
        return fetchStats()(_dispatch, _getState).then((response) => {
          expect(response).toEqual({ polls: 523, responses: 1385 })
        })
      })

      it('Should catch error.', () => {
        window.fetch = jest.fn(() => jsonError(404, {
          message: 'There was an error'
        }))
        return fetchStats()(_dispatch, _getState).then((response) => {
          expect(response).toBeInstanceOf(APIError)
          expect(response.name).toBe('APIError')
          expect(response.details.status).toBe(404)
        })
      })

      it('Should dispatch updateStats().', () => {
        window.fetch = jest.fn(() => jsonOk({ polls: 523, responses: 1385 }))
        updateStats.mockImplementation(() => ({}))

        return fetchStats()(_dispatch, _getState).then(() => {
          expect(updateStats).toHaveBeenCalledTimes(1)
          expect(updateStats).toHaveBeenCalledWith({ polls: 523, responses: 1385 })
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          updateStats.mockRestore()
        })
      })
    })
  })
})

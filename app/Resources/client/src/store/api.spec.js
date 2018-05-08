/* global expect, jest */
import moment from 'moment'
import {
  ROUTE_POLL,
  ROUTE_RESPONSES,
  ROUTE_LOGIN,
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
  postLogin
} from 'store/api'
import * as poll from 'store/poll'
import * as user from 'store/user'

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

      user.userTokenSelector = jest.fn(() => 'USERTOKEN')
    })

    afterEach(() => {
      _dispatch.mockReset()
      _getState.mockReset()
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
        window.fetch = jest.fn(() => jsonOk({
          question: 'Question', identifier: 'hf0sd8fhoas'
        }))
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
        const _updatePoll = jest.spyOn(poll, 'updatePoll').mockImplementation(() => ({}))

        return postPoll()(_dispatch, _getState).then((response) => {
          expect(_updatePoll).toHaveBeenCalledTimes(1)
          expect(_updatePoll).toHaveBeenCalledWith({ question: 'Question', identifier: 'hf0sd8fhoas' })
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          _updatePoll.mockRestore()
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
        window.fetch = jest.fn(() => jsonOk({
          question: 'Question', identifier: 'hf0sd8fhoas'
        }))
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
        const _updatePoll = jest.spyOn(poll, 'updatePoll').mockImplementation(() => ({}))

        return fetchPoll('hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(_updatePoll).toHaveBeenCalledTimes(1)
          expect(_updatePoll).toHaveBeenCalledWith({ question: 'Question', identifier: 'hf0sd8fhoas' })
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          _updatePoll.mockRestore()
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
        window.fetch = jest.fn(() => jsonOk({
          question: 'Question', identifier: 'hf0sd8fhoas', deleted: true
        }))
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
        const _updatePoll = jest.spyOn(poll, 'updatePoll').mockImplementation(() => ({}))

        return deletePoll('hf0sd8fhoas')(_dispatch, _getState).then((response) => {
          expect(_updatePoll).toHaveBeenCalledTimes(1)
          expect(_updatePoll).toHaveBeenCalledWith(
            { question: 'Question', identifier: 'hf0sd8fhoas', deleted: true }
          )
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          _updatePoll.mockRestore()
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
            ROUTE_POLL + '?page=1&pageSize=' + poll.POLLS_PER_PAGE,
            { credentials: 'same-origin', headers: { Authorization: 'Bearer USERTOKEN' } }
          )
        })
      })

      it('Should dispatch setPolls().', () => {
        window.fetch = jest.fn(() => jsonOk({
          entities: [{ question: 'Question', identifier: 'hf0sd8fhoas' }]
        }))
        const _setPolls = jest.spyOn(poll, 'setPolls').mockImplementation(() => ({}))

        return fetchPolls(1)(_dispatch, _getState).then(() => {
          expect(_setPolls).toHaveBeenCalledTimes(1)
          expect(_setPolls).toHaveBeenCalledWith([{ question: 'Question', identifier: 'hf0sd8fhoas' }])
          expect(_dispatch).toHaveBeenCalledWith({})

          _setPolls.mockRestore()
        })
      })

      it('Should dispatch setPollPage().', () => {
        const _setPollPage = jest.spyOn(poll, 'setPollPage').mockImplementation(() => ({}))

        return fetchPolls(1)(_dispatch, _getState).then(() => {
          expect(_setPollPage).toHaveBeenCalledTimes(1)
          expect(_setPollPage).toHaveBeenCalledWith(0)
          expect(_dispatch).toHaveBeenCalledWith({})

          _setPollPage.mockRestore()
        })
      })

      it('Should dispatch setPollCount().', () => {
        window.fetch = jest.fn(() => jsonOk({
          total: 5
        }))
        const _setPollCount = jest.spyOn(poll, 'setPollCount').mockImplementation(() => ({}))

        return fetchPolls(1)(_dispatch, _getState).then(() => {
          expect(_setPollCount).toHaveBeenCalledTimes(1)
          expect(_setPollCount).toHaveBeenCalledWith(5)
          expect(_dispatch).toHaveBeenCalledWith({})

          _setPollCount.mockRestore()
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
        window.fetch = jest.fn(() => jsonOk({ username: 'username', token: 'js7XZ&$£ZZSSu2389' }))

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
        const _updateUser = jest.spyOn(user, 'updateUser').mockImplementation(() => ({}))

        return postLogin('username', 'password')(_dispatch).then((response) => {
          expect(_updateUser).toHaveBeenCalledTimes(1)
          expect(_updateUser).toHaveBeenCalledWith({ username: 'username', token: 'js7XZ&$£ZZSSu2389' })
          expect(_dispatch).toHaveBeenCalledTimes(1)
          expect(_dispatch).toHaveBeenCalledWith({})

          _updateUser.mockRestore()
        })
      })
    })
  })
})

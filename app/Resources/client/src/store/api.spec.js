/* eslint-env mocha */
/* global expect, sinon */
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
    expect(ROUTE_POLL).to.equal('/api/polls')
  })

  it('Should export a constant ROUTE_RESPONSES.', () => {
    expect(ROUTE_RESPONSES).to.equal('/responses')
  })

  describe('(Helper) extractResponse', () => {
    it('Should be a function.', () => {
      expect(extractResponse).to.be.a('function')
    })
  })

  describe('(Helper) onError', () => {
    it('Should be a function.', () => {
      expect(onError).to.be.a('function')
    })
  })

  describe('(Helper) getEndDateFromPoll', () => {
    let poll

    beforeEach(function () {
      poll = { question: 'Question', identifier: '', endType: null }
    })

    it('Should be a function.', () => {
      expect(getEndDateFromPoll).to.be.a('function')
    })

    it('Should return null when endType is null.', () => {
      expect(getEndDateFromPoll(poll)).to.equal(null)
    })

    it('Should return null when endType is endNever.', () => {
      poll.endType = 'endNever'
      expect(getEndDateFromPoll(poll)).to.equal(null)
    })

    it('Should return a date string when endType is endAt.', () => {
      poll.endType = 'endAt'
      poll.endAt = moment()
      expect(getEndDateFromPoll(poll)).to.equal(poll.endAt.format('YYYY-MM-DDTHH:mm:ssZ'))
    })

    it('Should return a date string when endType is endIn.', () => {
      poll.endType = 'endIn'
      poll.endIn = 5
      expect(getEndDateFromPoll(poll)).to.equal(
        moment()
          .add(poll.endIn, 'hours')
          .seconds(0)
          .milliseconds(0)
          .format('YYYY-MM-DDTHH:mm:ssZ')
      )
    })
  })

  describe('(API Calls)', () => {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(function () {
      sinon.stub(window, 'fetch')
      window.fetch.returns(jsonOk({}))

      _globalState = {
        poll    : [{ question: 'Question', identifier: '', multipleChoice: false, passphrase: '' }],
        answers : ['Answer'],
        user    : {},
      }
      _dispatchSpy = sinon.spy((action) => {
        if (typeof action === 'function') {
          return action(_dispatchSpy, _getStateSpy)
        } else {
          return action
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    afterEach(() => {
      window.fetch.restore()
    })

    describe('(Action Creator) postPoll', () => {
      it('Should be exported as a function.', () => {
        expect(postPoll).to.be.a('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(postPoll()).to.be.a('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return postPoll()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url and data.', () => {
        return postPoll()(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
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
        window.fetch.returns(jsonOk({ question: 'Question', identifier: 'hf0sd8fhoas' }))
        return postPoll()(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.deep.equal({ question: 'Question', identifier: 'hf0sd8fhoas' })
        })
      })

      it('Should catch error.', () => {
        window.fetch.returns(jsonError(404, { message: 'There was an error' }))
        return postPoll()(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.be.an.instanceof(APIError)
          expect(response.name).to.equal('APIError')
          expect(response.details.status).to.equal(404)
        })
      })

      it('Should dispatch updatePoll().', () => {
        window.fetch.returns(jsonOk({ question: 'Question', identifier: 'hf0sd8fhoas' }))
        const _updatePoll = sinon.stub(poll, 'updatePoll')

        _updatePoll.returns({})

        return postPoll()(_dispatchSpy, _getStateSpy).then((response) => {
          _updatePoll.should.have.been.calledOnce()
          _updatePoll.should.have.been.calledWith({ question: 'Question', identifier: 'hf0sd8fhoas' })
          _dispatchSpy.should.have.been.calledOnce()
          _dispatchSpy.should.have.been.calledWith(_updatePoll({ question: 'Question', identifier: 'hf0sd8fhoas' }))

          _updatePoll.restore()
        })
      })
    })

    describe('(Action Creator) fetchPoll', () => {
      it('Should be exported as a function.', () => {
        expect(fetchPoll).to.be.a('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(fetchPoll()).to.be.a('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url.', () => {
        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(ROUTE_POLL + '/hf0sd8fhoas', { credentials: 'same-origin' })
        })
      })

      it('Should call fetch with the passphrase.', () => {
        _globalState.poll = [{
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          multipleChoice : false,
          passphrase     : '1234'
        }]

        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas?passphrase=1234',
            { credentials: 'same-origin' }
          )
        })
      })

      it('Should return a promise with the response.', () => {
        window.fetch.returns(jsonOk({ question: 'Question', identifier: 'hf0sd8fhoas' }))
        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.deep.equal({ question: 'Question', identifier: 'hf0sd8fhoas' })
        })
      })

      it('Should catch error.', () => {
        window.fetch.returns(jsonError(404, { message: 'There was an error' }))
        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.be.an.instanceof(APIError)
          expect(response.name).to.equal('APIError')
          expect(response.details.status).to.equal(404)
        })
      })

      it('Should dispatch updatePoll().', () => {
        window.fetch.returns(jsonOk({ question: 'Question', identifier: 'hf0sd8fhoas' }))
        const _updatePoll = sinon.stub(poll, 'updatePoll')

        _updatePoll.returns({})

        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          _updatePoll.should.have.been.calledOnce()
          _updatePoll.should.have.been.calledWith({ question: 'Question', identifier: 'hf0sd8fhoas' })
          _dispatchSpy.should.have.been.calledOnce()
          _dispatchSpy.should.have.been.calledWith(_updatePoll({ question: 'Question', identifier: 'hf0sd8fhoas' }))

          _updatePoll.restore()
        })
      })
    })

    describe('(Action Creator) postResponse', () => {
      it('Should be exported as a function.', () => {
        expect(postResponse).to.be.a('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(postResponse()).to.be.a('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return postResponse()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
      })

      it('Should return a promise with the response.', () => {
        window.fetch.returns(jsonOk({}))
        return postResponse(434, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.deep.equal({})
        })
      })

      it('Should catch error.', () => {
        window.fetch.returns(jsonError(404, { message: 'There was an error' }))
        return postResponse()(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.be.an.instanceof(APIError)
          expect(response.name).to.equal('APIError')
          expect(response.details.status).to.equal(404)
        })
      })

      it('Should call fetch with the correct url and data.', () => {
        return postResponse(434, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[434]}' })
        })
      })

      it('Should call fetch with the correct url and data with passphrase.', () => {
        _globalState.poll = [{
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          multipleChoice : false,
          passphrase     : '1234'
        }]

        return postResponse(434, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[434],"passphrase":"1234"}' })
        })
      })

      it('Should call fetch with the correct data for multiple choice initial answer.', () => {
        _globalState = {
          poll    : [{
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            multipleChoice : true,
            userResponses  : []
          }],
          answers : ['Answer']
        }
        return postResponse(434, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[434]}' })
        })
      })

      it('Should call fetch with the correct data for multiple choice add answer.', () => {
        _globalState = {
          poll    : [{
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            multipleChoice : true,
            userResponses  : [433]
          }],
          answers : ['Answer']
        }
        return postResponse(434, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[433,434]}' })
        })
      })

      it('Should call fetch with the correct data for multiple choice remove answer.', () => {
        _globalState = {
          poll    : [{
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            multipleChoice : true,
            userResponses  : [433]
          }],
          answers : ['Answer']
        }
        _getStateSpy = sinon.spy(() => {
          return _globalState
        })
        return postResponse(433, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method: 'POST', credentials: 'same-origin', body: '{"answers":[]}' })
        })
      })
    })

    describe('(Action Creator) fetchResponses', () => {
      it('Should be exported as a function.', () => {
        expect(fetchResponses).to.be.a('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(fetchResponses()).to.be.a('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return fetchResponses()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url and data.', () => {
        return fetchResponses('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { credentials: 'same-origin' })
        })
      })

      it('Should call fetch with the passphrase.', () => {
        _globalState.poll = [{
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          multipleChoice : false,
          passphrase     : '1234'
        }]

        return fetchResponses('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_POLL + '/hf0sd8fhoas' + ROUTE_RESPONSES + '?passphrase=1234',
            { credentials: 'same-origin' })
        })
      })

      it('Should return a promise with the response.', () => {
        window.fetch.returns(jsonOk({}))
        return fetchResponses('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.deep.equal({})
        })
      })

      it('Should catch error.', () => {
        window.fetch.returns(jsonError(404, { message: 'There was an error' }))
        return fetchResponses()(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.be.an.instanceof(APIError)
          expect(response.name).to.equal('APIError')
          expect(response.details.status).to.equal(404)
        })
      })
    })

    describe('(Action Creator) postLogin', () => {
      it('Should be exported as a function.', () => {
        expect(postLogin).to.be.a('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(postLogin()).to.be.a('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return postLogin()(_dispatchSpy).should.eventually.be.fulfilled
      })

      it('Should call fetch with the correct url and data.', () => {
        return postLogin('username', 'password')(_dispatchSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
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
        window.fetch.returns(jsonOk({ username: 'username', token: 'js7XZ&$£ZZSSu2389' }))
        return postLogin('username', 'password')(_dispatchSpy).then((response) => {
          expect(response).to.deep.equal({ username: 'username', token: 'js7XZ&$£ZZSSu2389' })
        })
      })

      it('Should catch error.', () => {
        window.fetch.returns(jsonError(400, { message: 'There password is incorrect' }))
        return postLogin('username', 'wrongpassword')(_dispatchSpy).then((response) => {
          expect(response).to.be.an.instanceof(APIError)
          expect(response.name).to.equal('APIError')
          expect(response.details.status).to.equal(400)
        })
      })

      it('Should dispatch updateUser().', () => {
        window.fetch.returns(jsonOk({ username: 'username', token: 'js7XZ&$£ZZSSu2389' }))
        const _updateUser = sinon.stub(user, 'updateUser')

        _updateUser.returns({})

        return postLogin('username', 'password')(_dispatchSpy).then((response) => {
          _updateUser.should.have.been.calledOnce()
          _updateUser.should.have.been.calledWith({ username: 'username', token: 'js7XZ&$£ZZSSu2389' })
          _dispatchSpy.should.have.been.calledOnce()
          _dispatchSpy.should.have.been.calledWith(_updateUser({ username: 'username', token: 'js7XZ&$£ZZSSu2389' }))

          _updateUser.restore()
        })
      })
    })
  })
})
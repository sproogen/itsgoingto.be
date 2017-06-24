import {
  ROUTE_QUESTION,
  ROUTE_RESPONSES,
  extractResponse,
  onError,
  postPoll,
  fetchPoll,
  postResponse,
  fetchResponses
} from 'store/api'
import * as poll from 'store/poll'

const jsonOk = (body) => {
  let mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  })
  return Promise.resolve(mockResponse)
}

const jsonError = (status, body) => {
  let mockResponse = new window.Response(JSON.stringify(body), {
    status: status,
    headers: {
      'Content-type': 'application/json'
    }
  })
  return Promise.reject(mockResponse)
}

describe('(Store) API', () => {
  it('Should export a constant ROUTE_QUESTION.', () => {
    expect(ROUTE_QUESTION).to.equal('/api/questions')
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

  describe('(API Calls)', () => {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(function () {
      sinon.stub(window, 'fetch')
      window.fetch.returns(jsonOk({}))

      _globalState = {
        poll    : [{ question : 'Question', identifier : '' }],
        answers : ['Answer']
      }
      _dispatchSpy = sinon.spy((action) => {
        if (typeof action === 'function') {
          return action(_dispatchSpy, _getStateSpy)
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
            ROUTE_QUESTION,
            { method : 'POST', credentials : 'same-origin', body : '{"question":"Question","answers":["Answer"]}' }
          )
        })
      })

      it('Should return a promise with the response.', () => {
        window.fetch.returns(jsonOk({ question : 'Question', identifier: 'hf0sd8fhoas' }))
        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.deep.equal({ question : 'Question', identifier: 'hf0sd8fhoas' })
        })
      })

      it('Should catch error.', () => {
        window.fetch.returns(jsonError(404, { message: 'There was an error' }))
        return postPoll()(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.equal(false)
        })
      })

      it('Should dispatch updatePoll().', () => {
        window.fetch.returns(jsonOk({ question : 'Question', identifier: 'hf0sd8fhoas' }))
        let _updatePoll = sinon.stub(poll, 'updatePoll')
        _updatePoll.returns({})

        return postPoll()(_dispatchSpy, _getStateSpy).then((response) => {
          _updatePoll.should.have.been.calledOnce()
          _updatePoll.should.have.been.calledWith({ question : 'Question', identifier: 'hf0sd8fhoas' })
          _dispatchSpy.should.have.been.calledOnce()
          _dispatchSpy.should.have.been.calledWith(_updatePoll({ question : 'Question', identifier: 'hf0sd8fhoas' }))

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
          window.fetch.should.have.been.calledWith(ROUTE_QUESTION + '/hf0sd8fhoas', { credentials : 'same-origin' })
        })
      })

      it('Should return a promise with the response.', () => {
        window.fetch.returns(jsonOk({ question : 'Question', identifier: 'hf0sd8fhoas' }))
        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.deep.equal({ question : 'Question', identifier: 'hf0sd8fhoas' })
        })
      })

      it('Should catch error.', () => {
        window.fetch.returns(jsonError(404, { message: 'There was an error' }))
        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          expect(response).to.equal(false)
        })
      })

      it('Should dispatch updatePoll().', () => {
        window.fetch.returns(jsonOk({ question : 'Question', identifier: 'hf0sd8fhoas' }))
        let _updatePoll = sinon.stub(poll, 'updatePoll')
        _updatePoll.returns({})

        return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then((response) => {
          _updatePoll.should.have.been.calledOnce()
          _updatePoll.should.have.been.calledWith({ question : 'Question', identifier: 'hf0sd8fhoas' })
          _dispatchSpy.should.have.been.calledOnce()
          _dispatchSpy.should.have.been.calledWith(_updatePoll({ question : 'Question', identifier: 'hf0sd8fhoas' }))

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

      it('Should call fetch with the correct url and data.', () => {
        return postResponse(434, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).then(() => {
          window.fetch.should.have.been.calledOnce()
          window.fetch.should.have.been.calledWith(
            ROUTE_QUESTION + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { method : 'POST', credentials : 'same-origin', body : '{"answers":[434]}' })
        })
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
          expect(response).to.equal(false)
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
            ROUTE_QUESTION + '/hf0sd8fhoas' + ROUTE_RESPONSES,
            { credentials : 'same-origin' })
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
          expect(response).to.equal(false)
        })
      })
    })
  })
})

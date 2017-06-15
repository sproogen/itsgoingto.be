import {
  ROUTE_QUESTION,
  extractResponse,
  onError,
  postPoll,
  fetchPoll
} from 'store/api'

describe('(Store) API', () => {
  it('Should export a constant ROUTE_QUESTION.', () => {
    expect(ROUTE_QUESTION).to.equal('/api/questions')
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

  describe('(Action Creator) postPoll', () => {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(() => {
      _globalState = {
        poll    : [],
        answers : []
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    it('Should be exported as a function.', () => {
      expect(postPoll).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(postPoll()).to.be.a('function')
    })

    it('Should return a promise from that thunk that gets fulfilled.', () => {
      return postPoll()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
    })
  })

  describe('(Action Creator) fetchPoll', () => {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(() => {
      _globalState = {
        poll    : [],
        answers : []
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    it('Should be exported as a function.', () => {
      expect(fetchPoll).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(fetchPoll()).to.be.a('function')
    })

    it('Should return a promise from that thunk that gets fulfilled.', () => {
      return fetchPoll('hf0sd8fhoas')(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
    })
  })
})

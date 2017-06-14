import {
  POLL_UPDATE,
  QUESTION_UPDATE,
  initialPoll,
  initialState,
  pollSelector,
  questionSelector,
  hasQuestionSelector,
  updatePoll,
  updateQuestion,
  default as pollReducer
} from 'store/poll'
import { addAnswer, updateAnswers, clearAnswers } from 'store/answers'

describe('(Store) Poll', () => {
  it('Should export a constant POLL_UPDATE.', () => {
    expect(POLL_UPDATE).to.equal('POLL_UPDATE')
  })
  it('Should export a constant QUESTION_UPDATE.', () => {
    expect(QUESTION_UPDATE).to.equal('QUESTION_UPDATE')
  })
  it('Should export a constant initialPoll.', () => {
    expect(initialPoll).to.deep.equal({
      question   : '',
      identifier : '',
      answers    : []
    })
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(pollReducer).to.be.a('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(pollReducer(undefined, {})).to.deep.equal([])
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = pollReducer(undefined, {})
      expect(state).to.deep.equal([])
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal([])

      state = [initialPoll]
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal([initialPoll])
    })
  })

  const globalState = {
    poll: [{
      question   : 'Question',
      identifier : 'hf0sd8fhoas'
    }]
  }

  describe('(Selector) pollSelector', () => {
    it('Should return a poll with an identifier from the state global state.', () => {
      expect(pollSelector(globalState, 'hf0sd8fhoas')).to.deep.equal({
        question   : 'Question',
        identifier : 'hf0sd8fhoas'
      })
    })

    it('Should return an empty poll from the state global state.', () => {
      expect(pollSelector(globalState, 'dasdfasd')).to.deep.equal({
        question   : '',
        identifier : ''
      })
      expect(pollSelector(globalState)).to.deep.equal({
        question   : '',
        identifier : ''
      })
    })
  })

  describe('(Selector) questionSelector', () => {
    it('Should return the question text from a poll with an identifier in the state global state.', () => {
      expect(questionSelector(globalState, 'hf0sd8fhoas')).to.equal('Question')
    })
  })

  describe('(Selector) hasQuestionSelector', () => {
    it('Should return true if question text from a poll with an identifier in the state global state.', () => {
      expect(hasQuestionSelector(globalState, 'hf0sd8fhoas')).to.equal(true)
    })

    it('Should return false if no question text from a poll with an identifier in the state global state.', () => {
      expect(hasQuestionSelector(globalState, '')).to.equal(false)
    })
  })

  describe('(Action Creator) updatePoll', () => {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(() => {
      _globalState = {
        poll : pollReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          poll : pollReducer(_globalState.poll, action)
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    it('Should be exported as a function.', () => {
      expect(updatePoll).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(updatePoll(initialPoll)).to.be.a('function')
    })

    it('Should return a promise from that thunk that gets fulfilled.', () => {
      return updatePoll(initialPoll)(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
    })

    it('Should call dispatch exactly twice.', () => {
      return updatePoll(initialPoll)(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledTwice()
        })
    })

    it('Should dispatch POLL_UPDATE with data omitting answers and responses.', () => {
      return updatePoll({ question : '', identifier : '', answers: [], responses: 5})(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledWith({
            type : POLL_UPDATE,
            poll : { question : '', identifier : ''}
          })
        })
    })

    it('Should dispatch updateAnswers with answers.', () => {
      return updatePoll({ question : '', identifier : '', answers: []})(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledWith(updateAnswers([]))
        })
    })
  })

  describe('(Action Creator) updateQuestion', () => {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(() => {
      _globalState = {
        poll : pollReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          poll : pollReducer(_globalState.poll, action)
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    it('Should be exported as a function.', () => {
      expect(updateQuestion).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(updateQuestion()).to.be.a('function')
    })

    it('Should return a promise from that thunk that gets fulfilled.', () => {
      return updateQuestion()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
    })

    it('Should call dispatch exactly once and get state twice.', () => {
      return updateQuestion()(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledOnce()
          _getStateSpy.should.have.been.calledTwice()
        })
    })

    it('Should call dispatch with QUESTION_UPDATE.', () => {
      return updateQuestion('Question Text', 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledWith({
            type       : QUESTION_UPDATE,
            question   : 'Question Text',
            identifier : 'hf0sd8fhoas'
          })
        })
    })

    it('Should dispatch addAnswer() if now has question.', () => {
      return updateQuestion('Question Text', '')(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledWith(addAnswer())
        })
    })

    it('Should dispatch clearAnswers() if now doesn\'t have question.', () => {
      _globalState = {
        poll : [{question : 'Question Text', identifier : 'hf0sd8fhoas'}]
      }
      return updateQuestion('', 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledWith(clearAnswers())
        })
    })
  })

  describe('(Action Handler) POLL_UPDATE', () => {
    it('Should update the poll with identifier', () => {
      let state = [{ question : 'Question', identifier : 'hf0sd8fhoas'}]
      expect(state).to.deep.equal([{ question : 'Question', identifier : 'hf0sd8fhoas'}])

      state = pollReducer(state, {type : POLL_UPDATE, poll : {
        question   : 'Question Text',
        identifier : 'hf0sd8fhoas',
        deleted    : false,
        created    : 'Some Date or other'
      }})
      expect(state).to.deep.equal([{
        question   : 'Question Text',
        identifier : 'hf0sd8fhoas',
        deleted    : false,
        created    : 'Some Date or other'
      }])

      state = pollReducer(state, {type : POLL_UPDATE, poll : {
        question   : 'Different Question Text',
        identifier : 'hf0sd8fhoas',
        deleted    : true,
        created    : 'Some Date or other'
      }})
      expect(state).to.deep.equal([{
        question   : 'Different Question Text',
        identifier : 'hf0sd8fhoas',
        deleted    : true,
        created    : 'Some Date or other'
      }])
    })

    it('Should insert a new poll', () => {
      let state = [{ question : 'Question', identifier : 'hf0sd8fhoas'}, { question : 'Question', identifier : ''}]
      expect(state).to.deep.equal([{ question : 'Question', identifier : 'hf0sd8fhoas'}, { question : 'Question', identifier : ''}])

      state = pollReducer(state, {type : POLL_UPDATE, poll : {
        question   : 'Question Text',
        identifier : 'sf34rsdfsf',
        deleted    : false,
        created    : 'Some Date or other'
      }})
      expect(state).to.deep.equal([
        { question : 'Question', identifier : 'hf0sd8fhoas'},
        { question : 'Question', identifier : ''},
        {
          question   : 'Question Text',
          identifier : 'sf34rsdfsf',
          deleted    : false,
          created    : 'Some Date or other'
        }
      ])
    })
  })

  describe('(Action Handler) QUESTION_UPDATE', () => {
    it('Should update the question text for the poll with identifier', () => {
      let state = [{ question : 'Question', identifier : 'hf0sd8fhoas'}]
      expect(state).to.deep.equal([{ question : 'Question', identifier : 'hf0sd8fhoas'}])

      state = pollReducer(state, {type : QUESTION_UPDATE, question : 'Question Text', identifier : 'hf0sd8fhoas'})
      expect(state).to.deep.equal([{ question : 'Question Text', identifier : 'hf0sd8fhoas'}])

      state = pollReducer(state, {type : QUESTION_UPDATE, question : 'Different Question Text', identifier : 'hf0sd8fhoas'})
      expect(state).to.deep.equal([{ question : 'Different Question Text', identifier : 'hf0sd8fhoas'}])
    })

    it('Should insert the question text as a new poll', () => {
      let state = [{ question : 'Question', identifier : 'hf0sd8fhoas'}]
      expect(state).to.deep.equal([{ question : 'Question', identifier : 'hf0sd8fhoas'}])

      state = pollReducer(state, {type : QUESTION_UPDATE, question : 'Question Text', identifier : ''})
      expect(state).to.deep.equal([
        { question : 'Question', identifier : 'hf0sd8fhoas' },
        { question : 'Question Text', identifier : '' }
      ])
    })

    it('Should update the question text for a new poll', () => {
      let state = [
        { question : 'Question', identifier : 'hf0sd8fhoas' },
        { question : 'Question Text', identifier : '' }
      ]
      expect(state).to.deep.equal([
        { question : 'Question', identifier : 'hf0sd8fhoas' },
        { question : 'Question Text', identifier : '' }
      ])

      state = pollReducer(state, {type : QUESTION_UPDATE, question : 'Different Question Text', identifier : ''})
      expect(state).to.deep.equal([
        { question : 'Question', identifier : 'hf0sd8fhoas' },
        { question : 'Different Question Text', identifier : '' }
      ])
    })
  })
})

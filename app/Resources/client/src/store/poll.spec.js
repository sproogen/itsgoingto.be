/* eslint-env mocha */
/* global expect, sinon */
import {
  POLL_UPDATE,
  POLLS_SET,
  POLL_PAGE_SET,
  POLL_COUNT_SET,
  QUESTION_UPDATE,
  initialPoll,
  pollSelector,
  pollsSelector,
  pollPageSelector,
  pollCountSelector,
  questionSelector,
  hasQuestionSelector,
  totalResponsesSelector,
  userRespondedSelector,
  updatePoll,
  setPolls,
  setPollPage,
  setPollCount,
  updateQuestion,
  updateResponses,
  default as pollReducer
} from 'store/poll'
import { addAnswer, updateAnswers, clearAnswers } from 'store/answers'

const initialState = {
  polls : [],
  page  : null,
  count : 0
}

describe('(Store) Poll', () => {
  it('Should export a constant POLL_UPDATE.', () => {
    expect(POLL_UPDATE).to.equal('POLL_UPDATE')
  })
  it('Should export a constant QUESTION_UPDATE.', () => {
    expect(QUESTION_UPDATE).to.equal('QUESTION_UPDATE')
  })
  it('Should export a constant initialPoll.', () => {
    expect(initialPoll).to.deep.equal({
      question       : '',
      identifier     : '',
      multipleChoice : false,
      passphrase     : '',
      answers        : [],
      userResponses  : []
    })
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(pollReducer).to.be.a('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(pollReducer(undefined, {})).to.deep.equal(initialState)
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = pollReducer(undefined, {})

      expect(state).to.deep.equal(initialState)
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal(initialState)

      state = [initialPoll]
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal([initialPoll])
    })
  })

  describe('(Selectors)', () => {
    let _globalState

    beforeEach(() => {
      _globalState = {
        poll : {
          polls : [{
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            responsesCount : 5
          }],
          page  : null,
          count : 0
        }
      }
    })

    describe('(Selector) pollSelector', () => {
      it('Should be exported as a function.', () => {
        expect(pollSelector).to.be.a('function')
      })

      it('Should return a poll with an identifier from the global state.', () => {
        expect(pollSelector(_globalState, 'hf0sd8fhoas')).to.deep.equal({
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          responsesCount : 5
        })
      })

      it('Should return an empty poll from the global state.', () => {
        expect(pollSelector(_globalState, 'dasdfasd')).to.deep.equal({
          question       : '',
          identifier     : '',
          multipleChoice : false,
          passphrase     : '',
          userResponses  : []
        })
        expect(pollSelector(_globalState)).to.deep.equal({
          question       : '',
          identifier     : '',
          multipleChoice : false,
          passphrase     : '',
          userResponses  : []
        })
      })
    })

    describe('(Selector) pollsSelector', () => {
      beforeEach(() => {
        _globalState.poll.polls.push({
          question       : 'Question 2',
          identifier     : '',
        })
      })

      it('Should be exported as a function.', () => {
        expect(pollsSelector).to.be.a('function')
      })

      it('Should return all polls from the global state.', () => {
        expect(pollsSelector(_globalState)).to.deep.equal([
          {
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            responsesCount : 5
          },
          {
            question       : 'Question 2',
            identifier     : '',
          }
        ])
      })

      it('Should only return real polls from the global state when populated is true.', () => {
        expect(pollsSelector(_globalState, true)).to.deep.equal([
          {
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            responsesCount : 5
          }
        ])
      })
    })

    describe('(Selector) pollPageSelector', () => {
      it('Should be exported as a function.', () => {
        expect(pollPageSelector).to.be.a('function')
      })

      it('Should return the poll page in the global state.', () => {
        expect(pollPageSelector(_globalState)).to.equal(null)

        _globalState.poll.page = 2

        expect(pollPageSelector(_globalState)).to.equal(2)
      })
    })

    describe('(Selector) pollCountSelector', () => {
      it('Should be exported as a function.', () => {
        expect(pollCountSelector).to.be.a('function')
      })

      it('Should return the question text from a poll with an identifier in the global state.', () => {
        expect(pollCountSelector(_globalState)).to.equal(0)

        _globalState.poll.count = 3

        expect(pollCountSelector(_globalState)).to.equal(3)
      })
    })

    describe('(Selector) questionSelector', () => {
      it('Should be exported as a function.', () => {
        expect(questionSelector).to.be.a('function')
      })

      it('Should return the question text from a poll with an identifier in the global state.', () => {
        expect(questionSelector(_globalState, 'hf0sd8fhoas')).to.equal('Question')
      })
    })

    describe('(Selector) hasQuestionSelector', () => {
      it('Should return true if question text from a poll with an identifier in the global state.', () => {
        expect(hasQuestionSelector(_globalState, 'hf0sd8fhoas')).to.equal(true)
      })

      it('Should return false if no question text from a poll with an identifier in the global state.', () => {
        expect(hasQuestionSelector(_globalState, '')).to.equal(false)
      })
    })

    describe('(Selector) totalResponsesSelector', () => {
      it('Should be exported as a function.', () => {
        expect(totalResponsesSelector).to.be.a('function')
      })

      it('Should return the responses count from a poll with an identifier in the global state.', () => {
        expect(totalResponsesSelector(_globalState, 'hf0sd8fhoas')).to.equal(5)
      })

      it('Should return a default of 0 if there is no value.', () => {
        _globalState.poll.polls[0].responsesCount = undefined

        expect(totalResponsesSelector(_globalState, 'hf0sd8fhoas')).to.equal(0)
      })
    })

    describe('(Selector) userRespondedSelector', () => {
      it('Should be exported as a function.', () => {
        expect(userRespondedSelector).to.be.a('function')
      })

      it('Should return false if there are no response from a poll with an identifier in the global state.', () => {
        _globalState.poll.polls[0].userResponses = []

        expect(userRespondedSelector(_globalState, 'hf0sd8fhoas')).to.equal(false)
      })

      it('Should return true if there are response from a poll with an identifier in the global state.', () => {
         _globalState.poll.polls[0].userResponses = [1]

        expect(userRespondedSelector(_globalState, 'hf0sd8fhoas')).to.equal(true)
      })
    })
  })

  describe('(Action Creators)', () => {
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

    describe('(Action Creator) updatePoll', () => {
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
          .then((response) => {
            _dispatchSpy.should.have.been.calledTwice()
          })
      })

      it('Should dispatch POLL_UPDATE with data omitting answers.', () => {
        return updatePoll(
          { question : '', identifier : '', answers: [], userResponses: [245] }
        )(_dispatchSpy, _getStateSpy)
          .then(() => {
            _dispatchSpy.should.have.been.calledWith({
              type : POLL_UPDATE,
              poll : { question : '', identifier : '', userResponses: [245] }
            })
          })
      })

      it('Should dispatch updateAnswers with answers.', () => {
        return updatePoll({ question : '', identifier : '', answers: [] })(_dispatchSpy, _getStateSpy)
          .then(() => {
            _dispatchSpy.should.have.been.calledWith(updateAnswers([]))
          })
      })
    })

    describe('(Action Creator) setPolls', () => {
      it('Should be exported as a function.', () => {
        expect(setPolls).to.be.a('function')
      })

      it('Should return an action with type "POLLS_SET".', () => {
        expect(setPolls()).to.have.property('type', POLLS_SET)
      })

      it('Should assign the argument to the "polls" property with answers omitted.', () => {
        const polls = [
          { question : 'Question 1', identifier : 'asdfaw4esd', answers: [], userResponses: [5] },
          { question : 'Question 2', identifier : 'awthscvg34', answers: [], userResponses: [8, 5] }
        ]

        expect(setPolls(polls)).to.have.property('polls').to.deep.equal([
          { question : 'Question 1', identifier : 'asdfaw4esd', userResponses: [5] },
          { question : 'Question 2', identifier : 'awthscvg34', userResponses: [8, 5] }
        ])
      })
    })

    describe('(Action Creator) setPollPage', () => {
      it('Should be exported as a function.', () => {
        expect(setPollPage).to.be.a('function')
      })

      it('Should return an action with type "POLL_PAGE_SET".', () => {
        expect(setPollPage()).to.have.property('type', POLL_PAGE_SET)
      })

      it('Should assign the argument to the "page" property.', () => {
        const page = 5

        expect(setPollPage(page)).to.have.property('page', page)
      })
    })

    describe('(Action Creator) setPollCount', () => {
      it('Should be exported as a function.', () => {
        expect(setPollCount).to.be.a('function')
      })

      it('Should return an action with type "POLL_COUNT_SET".', () => {
        expect(setPollCount()).to.have.property('type', POLL_COUNT_SET)
      })

      it('Should assign the argument to the "count" property.', () => {
        const count = 20

        expect(setPollCount(count)).to.have.property('count', count)
      })
    })

    describe('(Action Creator) updateQuestion', () => {
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
          poll : {
            polls : [{ question : 'Question Text', identifier : 'hf0sd8fhoas' }],
            page  : null,
            count : 0
          }
        }
        return updateQuestion('', 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy)
          .then(() => {
            _dispatchSpy.should.have.been.calledWith(clearAnswers())
          })
      })
    })

    describe('(Action Creator) updateResponses', () => {
      const _responses = {
        userResponses  : [245],
        responsesCount : 5,
        answers        : [
          { id : 245, responsesCount: 3 },
          { id : 246, responsesCount: 2 }
        ]
      }

      it('Should be exported as a function.', () => {
        expect(updateResponses).to.be.a('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(updateResponses(_responses, 'hf0sd8fhoas')).to.be.a('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
      })

      it('Should call dispatch exactly twice.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy)
          .then((response) => {
            _dispatchSpy.should.have.been.calledTwice()
          })
      })

      it('Should dispatch POLL_UPDATE with data omitting answers.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy)
          .then(() => {
            _dispatchSpy.should.have.been.calledWith({
              type : POLL_UPDATE,
              poll : { identifier : 'hf0sd8fhoas', responsesCount : 5, userResponses: [245] }
            })
          })
      })

      it('Should dispatch updateAnswers with answers.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatchSpy, _getStateSpy)
          .then(() => {
            _dispatchSpy.should.have.been.calledWith(updateAnswers([
              { id : 245, responsesCount: 3 },
              { id : 246, responsesCount: 2 }
            ]))
          })
      })
    })
  })

  describe('(Action Handlers)', () => {
    describe('(Action Handler) POLL_UPDATE', () => {
      it('Should update the poll with identifier', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : POLL_UPDATE,
          poll : {
            question   : 'Question Text',
            identifier : 'hf0sd8fhoas',
            deleted    : false,
            created    : 'Some Date or other'
          }
        })
        expect(state).to.deep.equal({
          polls : [{
            question   : 'Question Text',
            identifier : 'hf0sd8fhoas',
            deleted    : false,
            created    : 'Some Date or other'
          }],
          page  : null,
          count : 0
        })

        state = pollReducer(state, { type : POLL_UPDATE,
          poll : {
            question   : 'Different Question Text',
            identifier : 'hf0sd8fhoas',
            deleted    : true,
            created    : 'Some Date or other'
          } })
        expect(state).to.deep.equal({
          polls : [{
            question   : 'Different Question Text',
            identifier : 'hf0sd8fhoas',
            deleted    : true,
            created    : 'Some Date or other'
          }],
          page  : null,
          count : 0
        })
      })

      it('Should update the poll with identifier with just responses', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas', responsesCount: 5 }],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : POLL_UPDATE,
          poll : {
            identifier     : 'hf0sd8fhoas',
            userResponses  : [245],
            responsesCount : 6
          } })
        expect(state).to.deep.equal({
          polls : [{
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            userResponses  : [245],
            responsesCount : 6
          }],
          page  : null,
          count : 0
        })

        state = pollReducer(state, { type : POLL_UPDATE,
          poll : {
            identifier : 'hf0sd8fhoas',
            userResponses  : [245, 246],
            responsesCount : 7
          } })
        expect(state).to.deep.equal({
          polls : [{
            question       : 'Question',
            identifier     : 'hf0sd8fhoas',
            userResponses  : [245, 246],
            responsesCount : 7
          }],
          page  : null,
          count : 0
        })
      })

      it('Should insert a new poll', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }, { question : 'Question', identifier : '' }],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : POLL_UPDATE,
          poll : {
            question   : 'Question Text',
            identifier : 'sf34rsdfsf',
            deleted    : false,
            created    : 'Some Date or other'
          } })
        expect(state).to.deep.equal({
          polls : [
            { question : 'Question', identifier : 'hf0sd8fhoas' },
            { question : 'Question', identifier : '' },
            {
              question   : 'Question Text',
              identifier : 'sf34rsdfsf',
              deleted    : false,
              created    : 'Some Date or other'
            }
          ],
          page  : null,
          count : 0
        })
      })
    })

    describe('(Action Handler) POLLS_SET', () => {
      it('Should set the polls in the state.', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : POLLS_SET,
          polls : [
            { question : 'Question 1', identifier : 'gf43wfasdfds' },
            { question : 'Question 2', identifier : 'dfgbr5tfgdaf' }
          ]
        })
        expect(state).to.deep.equal({
          polls : [
            { question : 'Question 1', identifier : 'gf43wfasdfds' },
            { question : 'Question 2', identifier : 'dfgbr5tfgdaf' }
          ],
          page  : null,
          count : 0
        })
      })
    })

    describe('(Action Handler) POLL_PAGE_SET', () => {
      it('Should set the poll page in the state.', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : POLL_PAGE_SET, page : 5 })
        expect(state).to.deep.equal({
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : 5,
          count : 0
        })

        state = pollReducer(state, { type : POLL_PAGE_SET, page : 4 })
        expect(state).to.deep.equal({
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : 4,
          count : 0
        })
      })
    })

    describe('(Action Handler) POLL_COUNT_SET', () => {
      it('Should set the poll count in the state.', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : POLL_COUNT_SET, count : 56 })
        expect(state).to.deep.equal({
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 56
        })

        state = pollReducer(state, { type : POLL_COUNT_SET, count : 102 })
        expect(state).to.deep.equal({
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 102
        })
      })
    })

    describe('(Action Handler) QUESTION_UPDATE', () => {
      it('Should update the question text for the poll with identifier', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        }

        state = pollReducer(
          state,
          { type : QUESTION_UPDATE, question : 'Question Text', identifier : 'hf0sd8fhoas' }
        )
        expect(state).to.deep.equal({
          polls : [{ question : 'Question Text', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        })

        state = pollReducer(
          state,
          { type : QUESTION_UPDATE, question : 'Different Question Text', identifier : 'hf0sd8fhoas' }
        )
        expect(state).to.deep.equal({
          polls : [{ question : 'Different Question Text', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        })
      })

      it('Should insert the question text as a new poll', () => {
        let state = {
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : QUESTION_UPDATE, question : 'Question Text', identifier : '' })
        expect(state).to.deep.equal({
          polls : [
            { question : 'Question', identifier : 'hf0sd8fhoas' },
            { question : 'Question Text', identifier : '', multipleChoice : false, passphrase : '', userResponses  : [] }
          ],
          page  : null,
          count : 0
        })
      })

      it('Should update the question text for a new poll', () => {
        let state = {
          polls : [
            { question : 'Question', identifier : 'hf0sd8fhoas' },
            { question : 'Question Text', identifier : '' }
          ],
          page  : null,
          count : 0
        }

        state = pollReducer(state, { type : QUESTION_UPDATE, question : 'Different Question Text', identifier : '' })
        expect(state).to.deep.equal({
          polls : [
            { question : 'Question', identifier : 'hf0sd8fhoas' },
            { question : 'Different Question Text', identifier : '' }
          ],
          page  : null,
          count : 0
        })
      })
    })
  })
})

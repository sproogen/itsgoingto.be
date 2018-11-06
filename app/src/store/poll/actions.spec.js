/* global expect, jest */
import {
  initialPoll,
  default as pollReducer
} from 'store/poll'
import {
  POLL_UPDATE,
  POLLS_SET,
  POLL_PAGE_SET,
  POLL_COUNT_SET,
  QUESTION_UPDATE,
  updatePoll,
  setPolls,
  setPollPage,
  setPollCount,
  updateQuestion,
  updateResponses,
  updateUserResponses,
} from 'store/poll/actions'
import { addAnswer, updateAnswers, clearAnswers } from 'store/answers/actions'

describe('(Store) Poll', () => {
  it('Should export a constant POLL_UPDATE.', () => {
    expect(POLL_UPDATE).toBe('POLL_UPDATE')
  })
  it('Should export a constant POLLS_SET.', () => {
    expect(POLLS_SET).toBe('POLLS_SET')
  })
  it('Should export a constant POLL_PAGE_SET.', () => {
    expect(POLL_PAGE_SET).toBe('POLL_PAGE_SET')
  })
  it('Should export a constant POLL_COUNT_SET.', () => {
    expect(POLL_COUNT_SET).toBe('POLL_COUNT_SET')
  })
  it('Should export a constant QUESTION_UPDATE.', () => {
    expect(QUESTION_UPDATE).toBe('QUESTION_UPDATE')
  })

  describe('(Action Creators)', () => {
    let _globalState
    let _dispatch
    let _getState

    beforeEach(() => {
      _globalState = {
        poll : pollReducer(undefined, {})
      }
      _dispatch = jest.fn((action) => {
        _globalState = {
          ..._globalState,
          poll : pollReducer(_globalState.poll, action)
        }
      })
      _getState = jest.fn(() => {
        return _globalState
      })
    })

    describe('(Action Creator) updatePoll', () => {
      it('Should be exported as a function.', () => {
        expect(typeof updatePoll).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updatePoll(initialPoll)).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return updatePoll(initialPoll)(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call dispatch exactly twice.', () => {
        return updatePoll(initialPoll)(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledTimes(2)
          })
      })

      it('Should dispatch POLL_UPDATE with data omitting answers.', () => {
        return updatePoll(
          { question: '', identifier: '', answers: [], userResponses: [245] }
        )(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith({
              type : POLL_UPDATE,
              poll : { question: '', identifier: '', userResponses: [245] }
            })
          })
      })

      it('Should dispatch updateAnswers with answers.', () => {
        return updatePoll({ question: '', identifier: '', answers: [] })(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith(updateAnswers([]))
          })
      })
    })

    describe('(Action Creator) setPolls', () => {
      it('Should be exported as a function.', () => {
        expect(typeof setPolls).toBe('function')
      })

      it('Should return an action with type "POLLS_SET".', () => {
        expect(setPolls()).toHaveProperty('type', POLLS_SET)
      })

      it('Should assign the argument to the "polls" property with answers omitted.', () => {
        const polls = [
          { question: 'Question 1', identifier: 'asdfaw4esd', answers: [], userResponses: [5] },
          { question: 'Question 2', identifier: 'awthscvg34', answers: [], userResponses: [8, 5] }
        ]

        expect(setPolls(polls)).toHaveProperty('polls')
        expect(setPolls(polls).polls).toEqual([
          { question: 'Question 1', identifier: 'asdfaw4esd', userResponses: [5] },
          { question: 'Question 2', identifier: 'awthscvg34', userResponses: [8, 5] }
        ])
      })
    })

    describe('(Action Creator) setPollPage', () => {
      it('Should be exported as a function.', () => {
        expect(typeof setPollPage).toBe('function')
      })

      it('Should return an action with type "POLL_PAGE_SET".', () => {
        expect(setPollPage()).toHaveProperty('type', POLL_PAGE_SET)
      })

      it('Should assign the argument to the "page" property.', () => {
        const page = 5

        expect(setPollPage(page)).toHaveProperty('page', page)
      })
    })

    describe('(Action Creator) setPollCount', () => {
      it('Should be exported as a function.', () => {
        expect(typeof setPollCount).toBe('function')
      })

      it('Should return an action with type "POLL_COUNT_SET".', () => {
        expect(setPollCount()).toHaveProperty('type', POLL_COUNT_SET)
      })

      it('Should assign the argument to the "count" property.', () => {
        const count = 20

        expect(setPollCount(count)).toHaveProperty('count', count)
      })
    })

    describe('(Action Creator) updateQuestion', () => {
      it('Should be exported as a function.', () => {
        expect(typeof updateQuestion).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateQuestion()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return updateQuestion()(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call dispatch exactly once and get state twice.', () => {
        return updateQuestion()(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledTimes(1)
            expect(_getState).toHaveBeenCalledTimes(2)
          })
      })

      it('Should call dispatch with QUESTION_UPDATE.', () => {
        return updateQuestion('Question Text', 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith({
              type       : QUESTION_UPDATE,
              question   : 'Question Text',
              identifier : 'hf0sd8fhoas'
            })
          })
      })

      it('Should dispatch addAnswer() if now has question.', () => {
        return updateQuestion('Question Text', '')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith(addAnswer())
          })
      })

      it('Should dispatch clearAnswers() if now doesn\'t have question.', () => {
        _globalState = {
          poll : {
            polls : [{ question: 'Question Text', identifier: 'hf0sd8fhoas' }],
            page  : null,
            count : 0
          }
        }
        return updateQuestion('', 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith(clearAnswers())
          })
      })
    })

    describe('(Action Creator) updateResponses', () => {
      const _responses = {
        userResponses  : [245],
        responsesCount : 5,
        answers        : [
          { id: 245, responsesCount: 3 },
          { id: 246, responsesCount: 2 }
        ]
      }

      it('Should be exported as a function.', () => {
        expect(typeof updateResponses).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateResponses(_responses, 'hf0sd8fhoas')).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call dispatch exactly twice.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledTimes(2)
          })
      })

      it('Should dispatch POLL_UPDATE with data omitting answers and users responses.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith({
              type : POLL_UPDATE,
              poll : { identifier: 'hf0sd8fhoas', responsesCount: 5 }
            })
          })
      })

      it('Should dispatch updateAnswers with answers.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith(updateAnswers([
              { id: 245, responsesCount: 3 },
              { id: 246, responsesCount: 2 }
            ]))
          })
      })
    })

    describe('(Action Creator) updateUserResponses', () => {
      const _responses = {
        userResponses  : [245],
        responsesCount : 5,
        answers        : [
          { id: 245, responsesCount: 3 },
          { id: 246, responsesCount: 2 }
        ]
      }

      it('Should be exported as a function.', () => {
        expect(typeof updateUserResponses).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateUserResponses(_responses, 'hf0sd8fhoas')).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        return updateUserResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call dispatch exactly once.', () => {
        return updateUserResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledTimes(1)
          })
      })

      it('Should dispatch POLL_UPDATE with data with just users responses.', () => {
        return updateUserResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith({
              type : POLL_UPDATE,
              poll : { identifier: 'hf0sd8fhoas', userResponses: [245] }
            })
          })
      })
    })
  })
})

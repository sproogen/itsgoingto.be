/* global expect, jest */
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
  page  : 0,
  count : 0
}

describe('(Store) Poll', () => {
  it('Should export a constant POLL_UPDATE.', () => {
    expect(POLL_UPDATE).toBe('POLL_UPDATE')
  })
  it('Should export a constant QUESTION_UPDATE.', () => {
    expect(QUESTION_UPDATE).toBe('QUESTION_UPDATE')
  })
  it('Should export a constant initialPoll.', () => {
    expect(initialPoll).toEqual({
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
      expect(typeof pollReducer).toBe('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(pollReducer(undefined, {})).toEqual(initialState)
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = pollReducer(undefined, {})

      expect(state).toEqual(initialState)
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual(initialState)

      state = [initialPoll]
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual([initialPoll])
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
          page  : 0,
          count : 0
        }
      }
    })

    describe('(Selector) pollSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof pollSelector).toBe('function')
      })

      it('Should return a poll with an identifier from the global state.', () => {
        expect(pollSelector(_globalState, 'hf0sd8fhoas')).toEqual({
          question       : 'Question',
          identifier     : 'hf0sd8fhoas',
          responsesCount : 5
        })
      })

      it('Should return an empty poll from the global state.', () => {
        expect(pollSelector(_globalState, 'dasdfasd')).toEqual({
          question       : '',
          identifier     : '',
          multipleChoice : false,
          passphrase     : '',
          userResponses  : []
        })
        expect(pollSelector(_globalState)).toEqual({
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
        expect(typeof pollsSelector).toBe('function')
      })

      it('Should return all polls from the global state.', () => {
        expect(pollsSelector(_globalState)).toEqual([
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
        expect(pollsSelector(_globalState, true)).toEqual([
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
        expect(typeof pollPageSelector).toBe('function')
      })

      it('Should return the poll page in the global state.', () => {
        expect(pollPageSelector(_globalState)).toBe(0)

        _globalState.poll.page = 2

        expect(pollPageSelector(_globalState)).toBe(2)
      })
    })

    describe('(Selector) pollCountSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof pollCountSelector).toBe('function')
      })

      it('Should return the question text from a poll with an identifier in the global state.', () => {
        expect(pollCountSelector(_globalState)).toBe(0)

        _globalState.poll.count = 3

        expect(pollCountSelector(_globalState)).toBe(3)
      })
    })

    describe('(Selector) questionSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof questionSelector).toBe('function')
      })

      it('Should return the question text from a poll with an identifier in the global state.', () => {
        expect(questionSelector(_globalState, 'hf0sd8fhoas')).toBe('Question')
      })
    })

    describe('(Selector) hasQuestionSelector', () => {
      it('Should return true if question text from a poll with an identifier in the global state.', () => {
        expect(hasQuestionSelector(_globalState, 'hf0sd8fhoas')).toBe(true)
      })

      it('Should return false if no question text from a poll with an identifier in the global state.', () => {
        expect(hasQuestionSelector(_globalState, '')).toBe(false)
      })
    })

    describe('(Selector) totalResponsesSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof totalResponsesSelector).toBe('function')
      })

      it('Should return the responses count from a poll with an identifier in the global state.', () => {
        expect(totalResponsesSelector(_globalState, 'hf0sd8fhoas')).toBe(5)
      })

      it('Should return a default of 0 if there is no value.', () => {
        _globalState.poll.polls[0].responsesCount = undefined

        expect(totalResponsesSelector(_globalState, 'hf0sd8fhoas')).toBe(0)
      })
    })

    describe('(Selector) userRespondedSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof userRespondedSelector).toBe('function')
      })

      it('Should return false if there are no response from a poll with an identifier in the global state.', () => {
        _globalState.poll.polls[0].userResponses = []

        expect(userRespondedSelector(_globalState, 'hf0sd8fhoas')).toBe(false)
      })

      it('Should return true if there are response from a poll with an identifier in the global state.', () => {
        _globalState.poll.polls[0].userResponses = [1]

        expect(userRespondedSelector(_globalState, 'hf0sd8fhoas')).toBe(true)
      })
    })
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
          .then((response) => {
            expect(_dispatch).toHaveBeenCalledTimes(2)
          })
      })

      it('Should dispatch POLL_UPDATE with data omitting answers.', () => {
        return updatePoll(
          { question : '', identifier : '', answers: [], userResponses: [245] }
        )(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith({
              type : POLL_UPDATE,
              poll : { question : '', identifier : '', userResponses: [245] }
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
          { question : 'Question 1', identifier : 'asdfaw4esd', answers: [], userResponses: [5] },
          { question : 'Question 2', identifier : 'awthscvg34', answers: [], userResponses: [8, 5] }
        ]

        expect(setPolls(polls)).toHaveProperty('polls')
        expect(setPolls(polls).polls).toEqual([
          { question : 'Question 1', identifier : 'asdfaw4esd', userResponses: [5] },
          { question : 'Question 2', identifier : 'awthscvg34', userResponses: [8, 5] }
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
            polls : [{ question : 'Question Text', identifier : 'hf0sd8fhoas' }],
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
          { id : 245, responsesCount: 3 },
          { id : 246, responsesCount: 2 }
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
          .then((response) => {
            expect(_dispatch).toHaveBeenCalledTimes(2)
          })
      })

      it('Should dispatch POLL_UPDATE with data omitting answers.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith({
              type : POLL_UPDATE,
              poll : { identifier : 'hf0sd8fhoas', responsesCount : 5, userResponses: [245] }
            })
          })
      })

      it('Should dispatch updateAnswers with answers.', () => {
        return updateResponses(_responses, 'hf0sd8fhoas')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith(updateAnswers([
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
        expect(state).toEqual({
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
        expect(state).toEqual({
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
        expect(state).toEqual({
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
        expect(state).toEqual({
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
        expect(state).toEqual({
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
        expect(state).toEqual({
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
        expect(state).toEqual({
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : 5,
          count : 0
        })

        state = pollReducer(state, { type : POLL_PAGE_SET, page : 4 })
        expect(state).toEqual({
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
        expect(state).toEqual({
          polls : [{ question : 'Question', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 56
        })

        state = pollReducer(state, { type : POLL_COUNT_SET, count : 102 })
        expect(state).toEqual({
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
        expect(state).toEqual({
          polls : [{ question : 'Question Text', identifier : 'hf0sd8fhoas' }],
          page  : null,
          count : 0
        })

        state = pollReducer(
          state,
          { type : QUESTION_UPDATE, question : 'Different Question Text', identifier : 'hf0sd8fhoas' }
        )
        expect(state).toEqual({
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
        expect(state).toEqual({
          polls : [
            { question : 'Question', identifier : 'hf0sd8fhoas' },
            {
              question       : 'Question Text',
              identifier     : '',
              multipleChoice : false,
              passphrase     : '',
              userResponses  : []
            }
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
        expect(state).toEqual({
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

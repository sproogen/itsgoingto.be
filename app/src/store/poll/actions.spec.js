import pollReducer from 'store/poll'
import {
  POLL_UPDATE,
  POLLS_SET,
  POLL_PAGE_SET,
  POLL_COUNT_SET,
  QUESTION_UPDATE,
  initialPoll
} from 'store/poll/constants'
import {
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
  describe('(Action Creators)', () => {
    let globalState
    let dispatch
    let getState

    beforeEach(() => {
      globalState = {
        poll: pollReducer(undefined, {})
      }
      dispatch = jest.fn((action) => {
        globalState = {
          ...globalState,
          poll: pollReducer(globalState.poll, action)
        }
      })
      getState = jest.fn(() => globalState)
    })

    describe('(Action Creator) updatePoll', () => {
      it('Should be exported as a function', () => {
        expect(typeof updatePoll).toBe('function')
      })

      it('Should return a function (is a thunk)', () => {
        expect(typeof updatePoll(initialPoll)).toBe('function')
      })

      it('Should call dispatch exactly twice', () => updatePoll(initialPoll)(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledTimes(2)
        }))

      it('Should dispatch POLL_UPDATE with data omitting answers', () => updatePoll({
        question: '', identifier: '', answers: [], userResponses: [245]
      })(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: POLL_UPDATE,
            poll: { question: '', identifier: '', userResponses: [245] }
          })
        }))

      it('Should dispatch updateAnswers with answers', () => updatePoll({
        question: '', identifier: '', answers: []
      })(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith(updateAnswers([]))
        }))

      it('Should call dispatch once with no answers', () => updatePoll({
        question: '', identifier: ''
      })(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledTimes(1)
        }))

      it('Should not dispatch updateAnswers with no answers', () => updatePoll({
        question: '', identifier: ''
      })(dispatch, getState)
        .then(() => {
          expect(dispatch).not.toHaveBeenCalledWith(updateAnswers([]))
        }))
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
          {
            question: 'Question 1', identifier: 'asdfaw4esd', answers: [], userResponses: [5]
          },
          {
            question: 'Question 2', identifier: 'awthscvg34', answers: [], userResponses: [8, 5]
          }
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

      it('Should call dispatch exactly once and get state twice.', () => updateQuestion()(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledTimes(1)
          expect(getState).toHaveBeenCalledTimes(2)
        }))

      it('Should call dispatch with QUESTION_UPDATE.', () => updateQuestion(
        'Question Text', 'hf0sd8fhoas'
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: QUESTION_UPDATE,
            question: 'Question Text',
            identifier: 'hf0sd8fhoas'
          })
        }))

      it('Should dispatch addAnswer() if now has question.', () => updateQuestion(
        'Question Text', ''
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith(addAnswer())
        }))

      it('Should dispatch clearAnswers() if now doesn\'t have question.', () => {
        globalState = {
          poll: {
            polls: [{ question: 'Question Text', identifier: 'hf0sd8fhoas' }],
            page: null,
            count: 0
          }
        }
        return updateQuestion('', 'hf0sd8fhoas')(dispatch, getState)
          .then(() => {
            expect(dispatch).toHaveBeenCalledWith(clearAnswers())
          })
      })
    })

    describe('(Action Creator) updateResponses', () => {
      const responses = {
        userResponses: [245],
        responsesCount: 5,
        answers: [
          { id: 245, responsesCount: 3 },
          { id: 246, responsesCount: 2 }
        ]
      }

      it('Should be exported as a function.', () => {
        expect(typeof updateResponses).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateResponses(responses, 'hf0sd8fhoas')).toBe('function')
      })

      it('Should call dispatch exactly twice.', () => updateResponses(
        responses, 'hf0sd8fhoas'
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledTimes(2)
        }))

      it('Should dispatch POLL_UPDATE with data omitting answers and users responses.', () => updateResponses(
        responses, 'hf0sd8fhoas'
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: POLL_UPDATE,
            poll: { identifier: 'hf0sd8fhoas', responsesCount: 5 }
          })
        }))

      it('Should dispatch updateAnswers with answers.', () => updateResponses(
        responses, 'hf0sd8fhoas'
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith(updateAnswers([
            { id: 245, responsesCount: 3 },
            { id: 246, responsesCount: 2 }
          ]))
        }))
    })

    describe('(Action Creator) updateUserResponses', () => {
      const responses = {
        userResponses: [245],
        responsesCount: 6,
        answers: [
          { id: 245, responsesCount: 4 },
          { id: 246, responsesCount: 2 }
        ]
      }

      it('Should be exported as a function.', () => {
        expect(typeof updateUserResponses).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateUserResponses(responses, 'hf0sd8fhoas')).toBe('function')
      })

      it('Should call dispatch exactly twice.', () => updateUserResponses(
        responses, 'hf0sd8fhoas'
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledTimes(2)
        }))

      it('Should dispatch POLL_UPDATE.', () => updateUserResponses(
        responses, 'hf0sd8fhoas'
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: POLL_UPDATE,
            poll: {
              identifier: 'hf0sd8fhoas',
              responsesCount: 6,
              userResponses: [245],
              answers: [
                { id: 245, responsesCount: 4 },
                { id: 246, responsesCount: 2 }
              ]
            }
          })
        }))

      it('Should dispatch updateAnswers with answers.', () => updateUserResponses(
        responses, 'hf0sd8fhoas'
      )(dispatch, getState)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith(updateAnswers([
            { id: 245, responsesCount: 4 },
            { id: 246, responsesCount: 2 }
          ]))
        }))
    })
  })
})

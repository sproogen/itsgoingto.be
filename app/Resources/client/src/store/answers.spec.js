/* global expect */
import {
  ANSWER_ADD,
  ANSWER_UPDATE,
  ANSWERS_UPDATE,
  ANSWER_REMOVE,
  ANSWERS_REMOVE_AFTER,
  ANSWERS_CLEAR,
  answersSelector,
  maxAnswerSelector,
  answerSelector,
  hasAnswerSelector,
  canSubmitPollSelector,
  addAnswer,
  updateAnswer,
  updateAnswers,
  removeAnswer,
  removeAfterAnswer,
  clearAnswers,
  default as answersReducer
} from 'store/answers'

describe('(Store) Answers', () => {
  it('Should export a constant ANSWER_ADD.', () => {
    expect(ANSWER_ADD).toBe('ANSWER_ADD')
  })
  it('Should export a constant ANSWER_UPDATE.', () => {
    expect(ANSWER_UPDATE).toBe('ANSWER_UPDATE')
  })
  it('Should export a constant ANSWERS_UPDATE.', () => {
    expect(ANSWERS_UPDATE).toBe('ANSWERS_UPDATE')
  })
  it('Should export a constant ANSWER_REMOVE.', () => {
    expect(ANSWER_REMOVE).toBe('ANSWER_REMOVE')
  })
  it('Should export a constant ANSWERS_REMOVE_AFTER.', () => {
    expect(ANSWERS_REMOVE_AFTER).toBe('ANSWERS_REMOVE_AFTER')
  })
  it('Should export a constant ANSWERS_CLEAR.', () => {
    expect(ANSWERS_CLEAR).toBe('ANSWERS_CLEAR')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(typeof answersReducer).toBe('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(answersReducer(undefined, {})).toEqual([])
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = answersReducer(undefined, {})

      expect(state).toEqual([])
      state = answersReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual([])

      state = [{}]
      state = answersReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual([{}])
    })
  })

  const _globalState = {
    answers: ['Answer 1', '', 'Answer 2', ' ']
  }

  describe('(Selectors)', () => {
    describe('(Selector) answersSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof answersSelector).toBe('function')
      })

      it('Should return the answers from the global state.', () => {
        expect(answersSelector(_globalState)).toEqual(['Answer 1', '', 'Answer 2', ' '])
      })
    })

    describe('(Selector) maxAnswerSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof maxAnswerSelector).toBe('function')
      })

      it('Should return the index of the last answer from the global state.', () => {
        expect(maxAnswerSelector(_globalState)).toBe(2)
      })
    })

    describe('(Selector) answerSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof answerSelector).toBe('function')
      })

      it('Should return answer at the index from the global state.', () => {
        expect(answerSelector(_globalState, 0)).toBe('Answer 1')
        expect(answerSelector(_globalState, 1)).toBe('')
        expect(answerSelector(_globalState, 2)).toBe('Answer 2')
      })
    })

    describe('(Selector) hasAnswerSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof hasAnswerSelector).toBe('function')
      })

      it('Should return true if the answer the index from the global state is not empty.', () => {
        expect(hasAnswerSelector(_globalState, 0)).toBe(true)
        expect(hasAnswerSelector(_globalState, 2)).toBe(true)
      })

      it('Should return false if the answer the index from the global state is empty.', () => {
        expect(hasAnswerSelector(_globalState, 1)).toBe(false)
        expect(hasAnswerSelector(_globalState, 3)).toBe(false)
      })
    })

    describe('(Selector) canSubmitPollSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof canSubmitPollSelector).toBe('function')
      })

      it('Should return true if there are more than 2 answers in the global state.', () => {
        expect(canSubmitPollSelector(_globalState)).toBe(true)
      })

      it('Should return false if there are 2 or less answers in the global state.', () => {
        const _globalState = {
          answers: ['Answer 1', '']
        }

        expect(canSubmitPollSelector(_globalState)).toBe(false)
      })
    })
  })

  describe('(Action Creators)', () => {
    describe('(Action Creator) addAnswer', () => {
      it('Should be exported as a function.', () => {
        expect(typeof addAnswer).toBe('function')
      })

      it('Should return an action with type "ANSWER_ADD".', () => {
        expect(addAnswer()).toHaveProperty('type', ANSWER_ADD)
      })
    })

    describe('(Action Creator) updateAnswer', () => {
      let _globalState
      let _dispatch
      let _getState

      beforeEach(() => {
        _globalState = {
          answers : ['']
        }
        _dispatch = jest.fn((action) => {
          _globalState = {
            ..._globalState,
            answers : answersReducer(_globalState.answers, action)
          }
        })
        _getState = jest.fn(() => {
          return _globalState
        })
      })

      it('Should be exported as a function.', () => {
        expect(typeof updateAnswer).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateAnswer()).toBe('function')
      })

      it('Should return a promise from that thunk that gets fulfilled.', () => {
        const index = 0

        return updateAnswer(index)(_dispatch, _getState).should.eventually.be.fulfilled
      })

      it('Should call dispatch exactly once and get state twice.', () => {
        const index = 0

        return updateAnswer(index)(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledTimes(1)
            expect(_getState).toHaveBeenCalledTimes(3)
          })
      })

      it('Should call dispatch with ANSWER_UPDATE, index and text.', () => {
        const index = 0

        return updateAnswer(index, 'Answer Text')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledWith({
              type  : ANSWER_UPDATE,
              index,
              text  : 'Answer Text'
            })
          })
      })

      it('Should dispatch addAnswer() if the last answer is updated and was empty.', () => {
        const index = 0

        return updateAnswer(index, 'Answer Text')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledTimes(2)
            expect(_dispatch).toHaveBeenCalledWith(addAnswer())
          })
      })

      it('Should dispatch removeAfterAnswer() if answer is updated to be empty.', () => {
        const index = 0

        _globalState = {
          answers : ['Answer 1', 'Answer 2']
        }
        return updateAnswer(index, '')(_dispatch, _getState)
          .then(() => {
            expect(_dispatch).toHaveBeenCalledTimes(2)
            expect(_dispatch).toHaveBeenCalledWith(removeAfterAnswer(2))
          })
      })
    })

    describe('(Action Creator) updateAnswers', () => {
      it('Should be exported as a function.', () => {
        expect(typeof updateAnswers).toBe('function')
      })

      it('Should assign the argument to the "answers" property.', () => {
        const answers = ['Answer 1', 'Answer 2']

        expect(updateAnswers(answers)).toHaveProperty('answers')
        expect(updateAnswers(answers).answers).toEqual(answers)
      })
    })

    describe('(Action Creator) removeAnswer', () => {
      it('Should be exported as a function.', () => {
        expect(typeof removeAnswer).toBe('function')
      })

      it('Should return an action with type "ANSWER_REMOVE".', () => {
        expect(removeAnswer()).toHaveProperty('type', ANSWER_REMOVE)
      })

      it('Should assign the argument to the "index" property.', () => {
        const index = 5

        expect(removeAnswer(index)).toHaveProperty('index', index)
      })
    })

    describe('(Action Creator) removeAfterAnswer', () => {
      it('Should be exported as a function.', () => {
        expect(typeof removeAfterAnswer).toBe('function')
      })

      it('Should return an action with type "ANSWERS_REMOVE_AFTER".', () => {
        expect(removeAfterAnswer()).toHaveProperty('type', ANSWERS_REMOVE_AFTER)
      })

      it('Should assign the argument to the "index" property.', () => {
        const index = 3

        expect(removeAfterAnswer(index)).toHaveProperty('index', index)
      })
    })

    describe('(Action Creator) clearAnswers', () => {
      it('Should be exported as a function.', () => {
        expect(typeof clearAnswers).toBe('function')
      })

      it('Should return an action with type "ANSWERS_CLEAR".', () => {
        expect(clearAnswers()).toHaveProperty('type', ANSWERS_CLEAR)
      })
    })
  })

  describe('(Action Handlers)', () => {
    describe('(Action Handler) ANSWER_ADD', () => {
      let _state = ['Answer 1', 'Answer 2']

      it('Should add a blank answer to state.', () => {
        _state = answersReducer(_state, { type : ANSWER_ADD })
        expect(_state).toEqual(['Answer 1', 'Answer 2', ''])
      })
    })

    describe('(Action Handler) ANSWER_UPDATE', () => {
      let _state = ['Answer 1', 'Answer 2']

      it('Should update the ansers in the state and the index.', () => {
        _state = answersReducer(_state, { type : ANSWER_UPDATE, text : 'Answer 2 Updated', index : 1 })
        expect(_state).toEqual(['Answer 1', 'Answer 2 Updated'])

        _state = answersReducer(_state, { type : ANSWER_UPDATE, text : 'Answer 1 Updated', index : 0 })
        expect(_state).toEqual(['Answer 1 Updated', 'Answer 2 Updated'])
      })
    })

    describe('(Action Handler) ANSWERS_UPDATE', () => {
      let _state = ['Answer 1', 'Answer 2']

      it('Should update the state to be the given answers.', () => {
        _state = answersReducer(
          _state,
          { type : ANSWERS_UPDATE, answers : [{ id : 3, answer : 'Answer 3' }, { id : 4, answer : 'Answer 4' }] }
        )
        expect(_state).toEqual([{ id : 3, answer : 'Answer 3' }, { id : 4, answer : 'Answer 4' }])

        _state = answersReducer(
          _state,
          { type : ANSWERS_UPDATE, answers : [{ id : 5, answer : 'Answer 5' }, { id : 6, answer : 'Answer 6' }] }
        )
        expect(_state).toEqual([{ id : 5, answer : 'Answer 5' }, { id : 6, answer : 'Answer 6' }])
      })

      it('Should update the state to be the given answers updating exisitng answers.', () => {
        _state = answersReducer(
          _state,
          { type : ANSWERS_UPDATE, answers : [{ id : 3, answer : 'Answer 3' }, { id : 4, answer : 'Answer 4' }] }
        )
        expect(_state).toEqual([{ id : 3, answer : 'Answer 3' }, { id : 4, answer : 'Answer 4' }])

        _state = answersReducer(
          _state,
          { type : ANSWERS_UPDATE, answers : [{ id : 3, responseCount : 2 }, { id : 4, responseCount : 1 }] }
        )
        expect(_state).toEqual(
          [{ id : 3, answer : 'Answer 3', responseCount : 2 }, { id : 4, answer : 'Answer 4', responseCount : 1 }]
        )
      })
    })

    describe('(Action Handler) ANSWER_REMOVE', () => {
      it('Should remove the answer at the index from the state.', () => {
        let _state = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5']

        _state = answersReducer(_state, { type : ANSWER_REMOVE, index : 2 })
        expect(_state).toEqual(['Answer 1', 'Answer 2', 'Answer 4', 'Answer 5'])

        _state = answersReducer(_state, { type : ANSWER_REMOVE, index : 1 })
        expect(_state).toEqual(['Answer 1', 'Answer 4', 'Answer 5'])
      })

      it('Should not remove the last answer from the state.', () => {
        let _state = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5']

        _state = answersReducer(_state, { type : ANSWER_REMOVE, index : 4 })
        expect(_state).toEqual(['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5'])
      })
    })

    describe('(Action Handler) ANSWERS_REMOVE_AFTER', () => {
      let _state = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5']

      it('Should remove all the answers from the state after the index.', () => {
        _state = answersReducer(_state, { type : ANSWERS_REMOVE_AFTER, index : 2 })
        expect(_state).toEqual(['Answer 1', 'Answer 2', 'Answer 3'])

        _state = answersReducer(_state, { type : ANSWERS_REMOVE_AFTER, index : 1 })
        expect(_state).toEqual(['Answer 1', 'Answer 2'])
      })
    })

    describe('(Action Handler) ANSWERS_CLEAR', () => {
      let _state = ['Answer 1', 'Answer 2']

      it('Should clear all the answers in the state.', () => {
        _state = answersReducer(_state, { type : ANSWERS_CLEAR })
        expect(_state).toEqual([])

        _state = answersReducer(_state, { type : ANSWERS_CLEAR })
        expect(_state).toEqual([])
      })
    })
  })
})

/* global expect, jest */
import {
  default as answersReducer
} from 'store/answers'
import {
  ANSWER_ADD,
  ANSWER_UPDATE,
  ANSWERS_UPDATE,
  ANSWER_REMOVE,
  ANSWERS_REMOVE_AFTER,
  ANSWERS_CLEAR,
  addAnswer,
  updateAnswer,
  updateAnswers,
  removeAnswer,
  removeAfterAnswer,
  clearAnswers,
} from 'store/answers/actions'

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
})

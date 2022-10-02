import answersReducer from 'store/answers'
import {
  ANSWER_ADD,
  ANSWER_UPDATE,
  ANSWERS_UPDATE,
  ANSWER_REMOVE,
  ANSWERS_REMOVE_AFTER,
  ANSWERS_CLEAR,
} from 'store/answers/constants'
import {
  addAnswer,
  updateAnswer,
  updateAnswers,
  removeAnswer,
  removeAfterAnswer,
  clearAnswers,
} from 'store/answers/actions'

describe('(Store) Answers', () => {
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
      let globalState
      let dispatch
      let getState

      beforeEach(() => {
        globalState = {
          answers: [''],
        }
        dispatch = jest.fn((action) => {
          globalState = {
            ...globalState,
            answers: answersReducer(globalState.answers, action),
          }
        })
        getState = jest.fn(() => globalState)
      })

      it('Should be exported as a function.', () => {
        expect(typeof updateAnswer).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateAnswer()).toBe('function')
      })

      it('Should call dispatch exactly once and get state twice.', () => {
        const index = 0

        return updateAnswer(index)(dispatch, getState)
          .then(() => {
            expect(dispatch).toHaveBeenCalledTimes(1)
            expect(getState).toHaveBeenCalledTimes(3)
          })
      })

      it('Should call dispatch with ANSWER_UPDATE, index and text.', () => {
        const index = 0

        return updateAnswer(index, 'Answer Text')(dispatch, getState)
          .then(() => {
            expect(dispatch).toHaveBeenCalledWith({
              type : ANSWER_UPDATE,
              index,
              text: 'Answer Text',
            })
          })
      })

      it('Should dispatch addAnswer() if the last answer is updated and was empty.', () => {
        const index = 0

        return updateAnswer(index, 'Answer Text')(dispatch, getState)
          .then(() => {
            expect(dispatch).toHaveBeenCalledTimes(2)
            expect(dispatch).toHaveBeenCalledWith(addAnswer())
          })
      })

      it('Should dispatch removeAfterAnswer() if answer is updated to be empty.', () => {
        const index = 0

        globalState = {
          answers: ['Answer 1', 'Answer 2'],
        }
        return updateAnswer(index, '')(dispatch, getState)
          .then(() => {
            expect(dispatch).toHaveBeenCalledTimes(2)
            expect(dispatch).toHaveBeenCalledWith(removeAfterAnswer(2))
          })
      })
    })

    describe('(Action Creator) updateAnswers', () => {
      it('Should be exported as a function.', () => {
        expect(typeof updateAnswers).toBe('function')
      })

      it('Should return an action with type "ANSWERS_UPDATE".', () => {
        expect(updateAnswers()).toHaveProperty('type', ANSWERS_UPDATE)
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

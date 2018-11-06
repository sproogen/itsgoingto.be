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
} from 'store/answers/actions'

describe('(Store) Answers', () => {
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

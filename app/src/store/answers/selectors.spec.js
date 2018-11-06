/* global expect, jest */
import {
  answersSelector,
  maxAnswerSelector,
  answerSelector,
  hasAnswerSelector,
  canSubmitPollSelector,
} from 'store/answers/selectors'

const _globalState = {
  answers: ['Answer 1', '', 'Answer 2', ' ']
}

describe('(Selectors) Answers', () => {
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
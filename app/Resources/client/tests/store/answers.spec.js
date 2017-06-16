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
    expect(ANSWER_ADD).to.equal('ANSWER_ADD')
  })
  it('Should export a constant ANSWER_UPDATE.', () => {
    expect(ANSWER_UPDATE).to.equal('ANSWER_UPDATE')
  })
  it('Should export a constant ANSWERS_UPDATE.', () => {
    expect(ANSWERS_UPDATE).to.equal('ANSWERS_UPDATE')
  })
  it('Should export a constant ANSWER_REMOVE.', () => {
    expect(ANSWER_REMOVE).to.equal('ANSWER_REMOVE')
  })
  it('Should export a constant ANSWERS_REMOVE_AFTER.', () => {
    expect(ANSWERS_REMOVE_AFTER).to.equal('ANSWERS_REMOVE_AFTER')
  })
  it('Should export a constant ANSWERS_CLEAR.', () => {
    expect(ANSWERS_CLEAR).to.equal('ANSWERS_CLEAR')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(answersReducer).to.be.a('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(answersReducer(undefined, {})).to.deep.equal([])
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = answersReducer(undefined, {})
      expect(state).to.deep.equal([])
      state = answersReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal([])

      state = [{}]
      state = answersReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal([{}])
    })
  })

  const _globalState = {
    answers: ['Answer 1', '', 'Answer 2', ' ']
  }

  describe('(Selector) answersSelector', () => {
    it('Should be exported as a function.', () => {
      expect(answersSelector).to.be.a('function')
    })

    it('Should return the answers from the global state.', () => {
      expect(answersSelector(_globalState)).to.deep.equal(['Answer 1', '', 'Answer 2', ' '])
    })
  })

  describe('(Selector) maxAnswerSelector', () => {
    it('Should be exported as a function.', () => {
      expect(maxAnswerSelector).to.be.a('function')
    })

    it('Should return the index of the last answer from the global state.', () => {
      expect(maxAnswerSelector(_globalState)).to.equal(2)
    })
  })

  describe('(Selector) answerSelector', () => {
    it('Should be exported as a function.', () => {
      expect(answerSelector).to.be.a('function')
    })

    it('Should return answer at the index from the global state.', () => {
      expect(answerSelector(_globalState, 0)).to.equal('Answer 1')
      expect(answerSelector(_globalState, 1)).to.equal('')
      expect(answerSelector(_globalState, 2)).to.equal('Answer 2')
    })
  })

  describe('(Selector) hasAnswerSelector', () => {
    it('Should be exported as a function.', () => {
      expect(hasAnswerSelector).to.be.a('function')
    })

    it('Should return true if the answer the index from the global state is not empty.', () => {
      expect(hasAnswerSelector(_globalState, 0)).to.equal(true)
      expect(hasAnswerSelector(_globalState, 2)).to.equal(true)
    })

    it('Should return false if the answer the index from the global state is empty.', () => {
      expect(hasAnswerSelector(_globalState, 1)).to.equal(false)
      expect(hasAnswerSelector(_globalState, 3)).to.equal(false)
    })
  })

  describe('(Selector) canSubmitPollSelector', () => {
    it('Should be exported as a function.', () => {
      expect(canSubmitPollSelector).to.be.a('function')
    })

    it('Should return true if there are more than 2 answers in the global state.', () => {
      expect(canSubmitPollSelector(_globalState)).to.equal(true)
    })

    it('Should return false if there are 2 or less answers in the global state.', () => {
      const _globalState = {
        answers: ['Answer 1', '']
      }
      expect(canSubmitPollSelector(_globalState)).to.equal(false)
    })
  })

  describe('(Action Creator) addAnswer', () => {
    it('Should be exported as a function.', () => {
      expect(addAnswer).to.be.a('function')
    })
  })

  describe('(Action Creator) updateAnswer', () => {
    it('Should be exported as a function.', () => {
      expect(updateAnswer).to.be.a('function')
    })
  })

  describe('(Action Creator) updateAnswers', () => {
    it('Should be exported as a function.', () => {
      expect(updateAnswers).to.be.a('function')
    })
  })

  describe('(Action Creator) removeAnswer', () => {
    it('Should be exported as a function.', () => {
      expect(removeAnswer).to.be.a('function')
    })
  })

  describe('(Action Creator) removeAfterAnswer', () => {
    it('Should be exported as a function.', () => {
      expect(removeAfterAnswer).to.be.a('function')
    })
  })

  describe('(Action Creator) clearAnswers', () => {
    it('Should be exported as a function.', () => {
      expect(clearAnswers).to.be.a('function')
    })
  })

  describe('(Action Handler) ANSWER_ADD', () => {
  })

  describe('(Action Handler) ANSWER_UPDATE', () => {
  })

  describe('(Action Handler) ANSWERS_UPDATE', () => {
  })

  describe('(Action Handler) ANSWER_REMOVE', () => {
  })

  describe('(Action Handler) ANSWERS_REMOVE_AFTER', () => {
  })

  describe('(Action Handler) ANSWERS_CLEAR', () => {
  })
})

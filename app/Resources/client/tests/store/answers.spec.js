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
    let _state = ['Answer 1', 'Answer 2']

    it('Should add a blank answer to state.', () => {
      _state = answersReducer(_state, { type : ANSWER_ADD })
      expect(_state).to.deep.equal(['Answer 1', 'Answer 2', ''])
    })
  })

  describe('(Action Handler) ANSWER_UPDATE', () => {
    let _state = ['Answer 1', 'Answer 2']

    it('Should update the ansers in the state and the index.', () => {
      _state = answersReducer(_state, { type : ANSWER_UPDATE, text : 'Answer 2 Updated', index : 1})
      expect(_state).to.deep.equal(['Answer 1', 'Answer 2 Updated'])

      _state = answersReducer(_state, { type : ANSWER_UPDATE, text : 'Answer 1 Updated', index : 0})
      expect(_state).to.deep.equal(['Answer 1 Updated', 'Answer 2 Updated'])
    })
  })

  describe('(Action Handler) ANSWERS_UPDATE', () => {
    let _state = ['Answer 1', 'Answer 2']

    it('Should update the state to be the given answers.', () => {
      _state = answersReducer(_state, { type : ANSWERS_UPDATE, answers : ['Answer 3', 'Answer 4']})
      expect(_state).to.deep.equal(['Answer 3', 'Answer 4'])

      _state = answersReducer(_state, { type : ANSWERS_UPDATE, answers : ['Answer 5', 'Answer 6']})
      expect(_state).to.deep.equal(['Answer 5', 'Answer 6'])
    })
  })

  describe('(Action Handler) ANSWER_REMOVE', () => {
    it('Should remove the answer at the index from the state.', () => {
      let _state = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5']

      _state = answersReducer(_state, { type : ANSWER_REMOVE, index : 2})
      expect(_state).to.deep.equal(['Answer 1', 'Answer 2', 'Answer 4', 'Answer 5'])

      _state = answersReducer(_state, { type : ANSWER_REMOVE, index : 1})
      expect(_state).to.deep.equal(['Answer 1', 'Answer 4', 'Answer 5'])
    })

    it('Should not remove the last answer from the state.', () => {
      let _state = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5']

      _state = answersReducer(_state, { type : ANSWER_REMOVE, index : 4})
      expect(_state).to.deep.equal(['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5'])
    })
  })

  describe('(Action Handler) ANSWERS_REMOVE_AFTER', () => {
    let _state = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5']

    it('Should remove all the answers from the state after the index.', () => {
      _state = answersReducer(_state, { type : ANSWERS_REMOVE_AFTER, index : 2})
      expect(_state).to.deep.equal(['Answer 1', 'Answer 2', 'Answer 3'])

      _state = answersReducer(_state, { type : ANSWERS_REMOVE_AFTER, index : 1})
      expect(_state).to.deep.equal(['Answer 1', 'Answer 2'])
    })
  })

  describe('(Action Handler) ANSWERS_CLEAR', () => {
    let _state = ['Answer 1', 'Answer 2']

    it('Should clear all the answers in the state.', () => {
      _state = answersReducer(_state, { type : ANSWERS_CLEAR})
      expect(_state).to.deep.equal([])

      _state = answersReducer(_state, { type : ANSWERS_CLEAR})
      expect(_state).to.deep.equal([])
    })
  })
})

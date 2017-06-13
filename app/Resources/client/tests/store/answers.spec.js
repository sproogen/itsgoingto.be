import {
  ANSWER_ADD,
  ANSWER_UPDATE,
  ANSWERS_UPDATE,
  ANSWER_REMOVE,
  ANSWERS_REMOVE_AFTER,
  ANSWERS_CLEAR,
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
})

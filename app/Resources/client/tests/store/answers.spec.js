import {
  ANSWER_ADD,
  default as answersReducer
} from 'store/answers'

describe('(Store) Answers', () => {
  it('Should export a constant ANSWER_ADD.', () => {
    expect(ANSWER_ADD).to.equal('ANSWER_ADD')
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

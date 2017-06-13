import {
  POLL_UPDATE,
  initialPoll,
  default as pollReducer
} from 'store/poll'

describe('(Store) Poll', () => {
  it('Should export a constant POLL_UPDATE.', () => {
    expect(POLL_UPDATE).to.equal('POLL_UPDATE')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(pollReducer).to.be.a('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(pollReducer(undefined, {})).to.deep.equal([])
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = pollReducer(undefined, {})
      expect(state).to.deep.equal([])
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal([])

      state = [initialPoll]
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal([initialPoll])
    })
  })
})

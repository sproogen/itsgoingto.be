import { STATS_UPDATE } from 'store/stats/constants'
import statsReducer from 'store/stats'

const initialState = {
  polls: null,
  responses: null,
}

describe('(Store) Stats', () => {
  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(typeof statsReducer).toBe('function')
    })

    it('Should initialize with an initialState.', () => {
      expect(statsReducer(undefined, {})).toEqual(initialState)
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = statsReducer(undefined, {})

      expect(state).toEqual(initialState)
      state = statsReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual(initialState)

      state = { polls: 5, responses: 13 }
      state = statsReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual({ polls: 5, responses: 13 })
    })
  })

  describe('(Action Handlers)', () => {
    describe('(Action Handler) STATS_UPDATE', () => {
      let state = {}

      it('Should set the user object in the state.', () => {
        state = statsReducer(state, { type: STATS_UPDATE, stats: { polls: 5, responses: 13 } })
        expect(state).toEqual({ polls: 5, responses: 13 })

        state = statsReducer(state, { type: STATS_UPDATE, stats: initialState })
        expect(state).toEqual(initialState)
      })
    })
  })
})

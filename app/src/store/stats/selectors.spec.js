import { statSelector } from 'store/stats/selectors'
import statsReducer from 'store/stats'

const initialState = {
  polls: null,
  responses: null,
}

describe('(Store) Stats', () => {
  let globalState = {
    stats: statsReducer(undefined, {})
  }

  describe('(Selectors)', () => {
    beforeEach(() => {
      globalState = {
        stats: { polls: 5, responses: 13 }
      }
    })

    describe('(Selector) statSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof statSelector).toBe('function')
      })

      it('Should return null for initial stats.', () => {
        globalState.stats = initialState
        expect(statSelector(globalState, 'polls')).toEqual(null)
        expect(statSelector(globalState, 'responses')).toEqual(null)
      })

      it('Should return the stat in the global state.', () => {
        expect(statSelector(globalState, 'polls')).toEqual(5)
        expect(statSelector(globalState, 'responses')).toEqual(13)
      })

      it('Should return undefined for no stat in the global state.', () => {
        expect(statSelector(globalState, 'no-stat')).toEqual(undefined)
      })
    })
  })
})

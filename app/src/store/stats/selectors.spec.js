/* global expect */
import {
  statSelector,
} from 'store/stats/selectors'
import {
  default as statsReducer
} from 'store/stats'

const initialState = {
  polls     : null,
  responses : null,
}

describe('(Store) Stats', () => {
  let _globalState = {
    stats: statsReducer(undefined, {})
  }

  describe('(Selectors)', () => {
    beforeEach(() => {
      _globalState = {
        stats: { polls: 5, responses: 13 }
      }
    })

    describe('(Selector) statSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof statSelector).toBe('function')
      })

      it('Should return null for initial stats.', () => {
        _globalState.stats = initialState
        expect(statSelector(_globalState, 'polls')).toEqual(null)
        expect(statSelector(_globalState, 'responses')).toEqual(null)
      })

      it('Should return the stat in the global state.', () => {
        expect(statSelector(_globalState, 'polls')).toEqual(5)
        expect(statSelector(_globalState, 'responses')).toEqual(13)
      })

      it('Should return undefined for no stat in the global state.', () => {
        expect(statSelector(_globalState, 'no-stat')).toEqual(undefined)
      })
    })
  })
})

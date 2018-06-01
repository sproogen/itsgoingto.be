/* global expect */
import {
  STATS_UPDATE,
  statSelector,
  updateStats,
  clearStats,
  default as statsReducer
} from 'store/stats'

const initialState = {
  polls     : null,
  responses : null,
}

describe('(Store) Stats', () => {
  it('Should export a constant STATS_UPDATE.', () => {
    expect(STATS_UPDATE).toBe('STATS_UPDATE')
  })

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

  let _globalState = {
    stats : statsReducer(undefined, {})
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

  describe('(Action Creators)', () => {
    describe('(Action Creator) updateStats', () => {
      it('Should be exported as a function.', () => {
        expect(typeof updateStats).toBe('function')
      })

      it('Should return an action with type "STATS_UPDATE".', () => {
        expect(updateStats({ polls: 5, responses: 13 })).toHaveProperty('type', STATS_UPDATE)
      })

      it('Should return an action with stats.', () => {
        expect(updateStats({ polls: 5, responses: 13 })).toHaveProperty('stats')
        expect(
          updateStats({ polls: 5, responses: 13 }).stats
        ).toEqual({ polls: 5, responses: 13 })
      })
    })

    describe('(Action Creator) clearStats', () => {
      it('Should be exported as a function.', () => {
        expect(typeof clearStats).toBe('function')
      })

      it('Should return an action with type "STATS_UPDATE".', () => {
        expect(clearStats()).toHaveProperty('type', STATS_UPDATE)
      })

      it('Should return an action with stats and the inital state.', () => {
        expect(clearStats()).toHaveProperty('stats')
        expect(clearStats().stats).toEqual(initialState)
      })
    })
  })

  describe('(Action Handlers)', () => {
    describe('(Action Handler) STATS_UPDATE', () => {
      let _state = {}

      it('Should set the user object in the state.', () => {
        _state = statsReducer(_state, { type: STATS_UPDATE, stats: { polls: 5, responses: 13 } })
        expect(_state).toEqual({ polls: 5, responses: 13 })

        _state = statsReducer(_state, { type: STATS_UPDATE, stats: initialState })
        expect(_state).toEqual(initialState)
      })
    })
  })
})

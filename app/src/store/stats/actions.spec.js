import { STATS_UPDATE } from 'store/stats/constants'
import {
  updateStats,
  clearStats,
} from 'store/stats/actions'

const initialState = {
  polls: null,
  responses: null,
}

describe('(Store) Stats', () => {
  it('Should export a constant STATS_UPDATE.', () => {
    expect(STATS_UPDATE).toBe('STATS_UPDATE')
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
})

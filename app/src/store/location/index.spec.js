/* global expect, jest */
import {
  default as locationReducer
} from 'store/location'
import {
  locationChange,
} from 'store/location/actions'

describe('(Internal Module) Location', () => {
  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(typeof locationReducer).toBe('function')
    })

    it('Should initialize with a location object.', () => {
      expect(typeof locationReducer(undefined, {})).toBe('object')
      expect(locationReducer(undefined, {})).toHaveProperty('pathname')
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = locationReducer(undefined, {})

      expect(typeof state).toBe('object')
      expect(state).toHaveProperty('pathname')
      expect(state).toHaveProperty('pathname', '/')
      state = locationReducer(state, { type: '@@@@@@@' })
      expect(state).toHaveProperty('pathname', '/')

      const locationState = { pathname: '/yup' }

      state = locationReducer(state, locationChange(locationState))
      expect(state).toBe(locationState)
      expect(state).toHaveProperty('pathname', '/yup')
      state = locationReducer(state, { type: '@@@@@@@' })
      expect(state).toBe(locationState)
      expect(state).toHaveProperty('pathname', '/yup')
    })
  })
})

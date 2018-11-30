/* global expect */
import {
  LOADING_UPDATE,
  PASSPHRASE_UPDATE,
} from 'store/loader/actions'
import {
  default as loaderReducer
} from 'store/loader'

describe('(Store) Loader', () => {
  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(typeof loaderReducer).toBe('function')
    })

    it('Should initialize with an initialState.', () => {
      expect(loaderReducer(undefined, {})).toEqual({ loading : false, passphrase : false })
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = loaderReducer(undefined, {})

      expect(state).toEqual({ loading : false, passphrase : false })
      state = loaderReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual({ loading : false, passphrase : false })

      state = true
      state = loaderReducer(state, { type: '@@@@@@@' })
      expect(state).toBe(true)
    })
  })

  describe('(Action Handlers)', () => {
    describe('(Action Handler) LOADING_UPDATE', () => {
      it('Should update the state to the loading property', () => {
        let state = { loading : false, passphrase : false }

        expect(state.loading).toBe(false)
        state = loaderReducer(state, { type : LOADING_UPDATE, loading : true })
        expect(state.loading).toBe(true)
        state = loaderReducer(state, { type : LOADING_UPDATE, loading : false })
        expect(state.loading).toBe(false)
      })
    })

    describe('(Action Handler) PASSPHRASE_UPDATE', () => {
      it('Should update the state to the passphrase property', () => {
        let state = { loading : false, passphrase : false }

        expect(state.passphrase).toBe(false)
        state = loaderReducer(state, { type : PASSPHRASE_UPDATE, requiresPassphrase : true })
        expect(state.passphrase).toBe(true)
        state = loaderReducer(state, { type : PASSPHRASE_UPDATE, requiresPassphrase : false })
        expect(state.passphrase).toBe(false)
      })
    })
  })
})

/* eslint-env mocha */
/* global expect */
import {
  LOADING_UPDATE,
  PASSPHRASE_UPDATE,
  isLoadingSelector,
  requiresPassphraseSelector,
  setLoading,
  setRequiresPassphrase,
  default as loaderReducer
} from 'store/loader'

describe('(Store) Loader', () => {
  it('Should export a constant LOADING_UPDATE.', () => {
    expect(LOADING_UPDATE).toBe('LOADING_UPDATE')
  })
  it('Should export a constant PASSPHRASE_UPDATE.', () => {
    expect(PASSPHRASE_UPDATE).toBe('PASSPHRASE_UPDATE')
  })

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

  describe('(Selectors)', () => {
    describe('(Selector) isLoadingSelector', () => {
      it('Should return the loader value from the global state.', () => {
        const globalState = { loader : { loading : true, passphrase : false } }

        expect(isLoadingSelector(globalState)).toBe(true)
      })
    })

    describe('(Selector) requiresPassphraseSelector', () => {
      it('Should return the passphrase required value from the global state.', () => {
        const globalState = { loader : { loading : false, passphrase : true } }

        expect(requiresPassphraseSelector(globalState)).toBe(true)
      })
    })
  })

  describe('(Action Creators)', () => {
    describe('(Action Creator) setLoading', () => {
      it('Should be exported as a function.', () => {
        expect(typeof setLoading).toBe('function')
      })

      it('Should return an action with type "LOADING_UPDATE".', () => {
        expect(setLoading()).toHaveProperty('type', LOADING_UPDATE)
      })

      it('Should assign the argument to the "loading" property.', () => {
        const loading = true

        expect(setLoading(loading)).toHaveProperty('loading', loading)
      })

      it('Should default the "loading" property to false if not provided.', () => {
        expect(setLoading()).toHaveProperty('loading', false)
      })
    })

    describe('(Action Creator) setRequiresPassphrase', () => {
      it('Should be exported as a function.', () => {
        expect(typeof setRequiresPassphrase).toBe('function')
      })

      it('Should return an action with type "PASSPHRASE_UPDATE".', () => {
        expect(setRequiresPassphrase()).toHaveProperty('type', PASSPHRASE_UPDATE)
      })

      it('Should assign the argument to the "requiresPassphrase" property.', () => {
        const requiresPassphrase = true

        expect(setRequiresPassphrase(requiresPassphrase)).toHaveProperty('requiresPassphrase', requiresPassphrase)
      })

      it('Should default the "requiresPassphrase" property to false if not provided.', () => {
        expect(setRequiresPassphrase()).toHaveProperty('requiresPassphrase', false)
      })
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

/* global expect */
import {
  LOADING_UPDATE,
  PASSPHRASE_UPDATE,
  setLoading,
  setRequiresPassphrase,
} from 'store/loader/actions'

describe('(Store) Loader', () => {
  it('Should export a constant LOADING_UPDATE.', () => {
    expect(LOADING_UPDATE).toBe('LOADING_UPDATE')
  })
  it('Should export a constant PASSPHRASE_UPDATE.', () => {
    expect(PASSPHRASE_UPDATE).toBe('PASSPHRASE_UPDATE')
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
})

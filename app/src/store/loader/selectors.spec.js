import {
  isLoadingSelector,
  requiresPassphraseSelector,
} from 'store/loader/selectors'

describe('(Store) Loader', () => {
  describe('(Selectors)', () => {
    describe('(Selector) isLoadingSelector', () => {
      it('Should return the loader value from the global state.', () => {
        const globalState = { loader: { loading: true, passphrase: false } }

        expect(isLoadingSelector(globalState)).toBe(true)
      })
    })

    describe('(Selector) requiresPassphraseSelector', () => {
      it('Should return the passphrase required value from the global state.', () => {
        const globalState = { loader: { loading: false, passphrase: true } }

        expect(requiresPassphraseSelector(globalState)).toBe(true)
      })
    })
  })
})

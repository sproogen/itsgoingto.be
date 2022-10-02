import userReducer from 'store/user'
import {
  hasUserSelector,
  userTokenSelector,
} from 'store/user/selectors'

describe('(Store) User', () => {
  let globalState = {
    user: userReducer(undefined, {}),
  }

  describe('(Selectors)', () => {
    beforeEach(() => {
      globalState = {
        user: {
          id: 1,
          username: 'admin',
          token: 'fd987%%^0|Zas2',
        },
      }
    })

    describe('(Selector) hasUserSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof hasUserSelector).toBe('function')
      })

      it('Should return true for a user with token in the global state.', () => {
        expect(hasUserSelector(globalState)).toEqual(true)
      })

      it('Should return false for no user with a token in the global state.', () => {
        globalState.user = {}
        expect(hasUserSelector(globalState)).toEqual(false)
      })
    })

    describe('(Selector) userTokenSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof userTokenSelector).toBe('function')
      })

      it('Should return the token for a user in the global state.', () => {
        expect(userTokenSelector(globalState)).toEqual('fd987%%^0|Zas2')
      })

      it('Should return undefined for no user with a token in the global state.', () => {
        globalState.user = {}
        expect(userTokenSelector(globalState)).toEqual(undefined)
      })
    })
  })
})

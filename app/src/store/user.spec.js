/* global expect */
import {
  USER_UPDATE,
  hasUserSelector,
  userTokenSelector,
  updateUser,
  clearUser,
  default as userReducer
} from 'store/user'

describe('(Store) User', () => {
  it('Should export a constant USER_UPDATE.', () => {
    expect(USER_UPDATE).toBe('USER_UPDATE')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(typeof userReducer).toBe('function')
    })

    it('Should initialize with an initialState.', () => {
      expect(userReducer(undefined, {})).toEqual({})
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = userReducer(undefined, {})

      expect(state).toEqual({})
      state = userReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual({})

      state = { username: 'admin' }
      state = userReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual({ username: 'admin' })
    })
  })

  let _globalState = {
    user : userReducer(undefined, {})
  }

  describe('(Selectors)', () => {
    beforeEach(() => {
      _globalState = {
        user: {
          id       : 1,
          username : 'admin',
          token    : 'fd987%%^0|Zas2',
        }
      }
    })

    describe('(Selector) hasUserSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof hasUserSelector).toBe('function')
      })

      it('Should return true for a user with token in the global state.', () => {
        expect(hasUserSelector(_globalState)).toEqual(true)
      })

      it('Should return false for no user with a token in the global state.', () => {
        _globalState.user = {}
        expect(hasUserSelector(_globalState)).toEqual(false)
      })
    })

    describe('(Selector) userTokenSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof userTokenSelector).toBe('function')
      })

      it('Should return the token for a user in the global state.', () => {
        expect(userTokenSelector(_globalState)).toEqual('fd987%%^0|Zas2')
      })

      it('Should return undefined for no user with a token in the global state.', () => {
        _globalState.user = {}
        expect(userTokenSelector(_globalState)).toEqual(undefined)
      })
    })
  })

  describe('(Action Creators)', () => {
    describe('(Action Creator) updateUser', () => {
      it('Should be exported as a function.', () => {
        expect(typeof updateUser).toBe('function')
      })

      it('Should return an action with type "USER_UPDATE".', () => {
        expect(updateUser({ username: 'admin', token: 'sdf32"£$FD' })).toHaveProperty('type', USER_UPDATE)
      })

      it('Should return an action with user.', () => {
        expect(updateUser({ username: 'admin', token: 'sdf32"£$FD' })).toHaveProperty('user')
        expect(
          updateUser({ username: 'admin', token: 'sdf32"£$FD' }).user
        ).toEqual({ username: 'admin', token: 'sdf32"£$FD' })
      })
    })

    describe('(Action Creator) clearUser', () => {
      it('Should be exported as a function.', () => {
        expect(typeof clearUser).toBe('function')
      })

      it('Should return an action with type "USER_UPDATE".', () => {
        expect(clearUser()).toHaveProperty('type', USER_UPDATE)
      })

      it('Should return an action with empty user.', () => {
        expect(clearUser()).toHaveProperty('user')
        expect(clearUser().user).toEqual({})
      })
    })
  })

  describe('(Action Handlers)', () => {
    describe('(Action Handler) USER_UPDATE', () => {
      let _state = {}

      it('Should set the user object in the state.', () => {
        _state = userReducer(_state, { type : USER_UPDATE, user : { username: 'admin', token: 'sdf32"£$FD' } })
        expect(_state).toEqual({ username: 'admin', token: 'sdf32"£$FD' })

        _state = userReducer(_state, { type : USER_UPDATE, user : {} })
        expect(_state).toEqual({})
      })
    })
  })
})

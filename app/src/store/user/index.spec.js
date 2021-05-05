import userReducer from 'store/user'
import { USER_UPDATE } from 'store/user/constants'

describe('(Store) User', () => {
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

  describe('(Action Handlers)', () => {
    describe('(Action Handler) USER_UPDATE', () => {
      let state = {}

      it('Should set the user object in the state.', () => {
        state = userReducer(state, { type: USER_UPDATE, user: { username: 'admin', token: 'sdf32"£$FD' } })
        expect(state).toEqual({ username: 'admin', token: 'sdf32"£$FD' })

        state = userReducer(state, { type: USER_UPDATE, user: {} })
        expect(state).toEqual({})
      })
    })
  })
})

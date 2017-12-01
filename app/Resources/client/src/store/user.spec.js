/* eslint-env mocha */
/* global expect */
import {
  USER_UPDATE,
  hasUserSelector,
  updateUser,
  clearUser,
  default as userReducer
} from 'store/user'

describe('(Store) User', () => {
  it('Should export a constant USER_UPDATE.', () => {
    expect(USER_UPDATE).to.equal('USER_UPDATE')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(userReducer).to.be.a('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(userReducer(undefined, {})).to.deep.equal({})
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = userReducer(undefined, {})

      expect(state).to.deep.equal({})
      state = userReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal({})

      state = { username: 'admin' }
      state = userReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal({ username: 'admin' })
    })
  })

  let _globalState = {
    user : userReducer(undefined, {})
  }

  describe('(Selector) hasUserSelector', () => {
    beforeEach(() => {
      _globalState = {
        user: {
          id       : 1,
          username : 'admin',
          token    : 'fd987%%^0|Zas2',
        }
      }
    })

    it('Should be exported as a function.', () => {
      expect(hasUserSelector).to.be.a('function')
    })

    it('Should return true for a user with token in the global state.', () => {
      expect(hasUserSelector(_globalState)).to.equal(true)
    })

    it('Should return false for a user with no token in the global state.', () => {
      _globalState.user = {}
      expect(hasUserSelector(_globalState)).to.equal(false)
    })
  })

  describe('(Action Creator) updateUser', () => {
    it('Should be exported as a function.', () => {
      expect(updateUser).to.be.a('function')
    })

    it('Should return an action with type "ANSWER_ADD".', () => {
      expect(updateUser({ username: 'admin', token: 'sdf32"£$FD' })).to.have.property('type', USER_UPDATE)
    })

    it('Should return an action with user.', () => {
      expect(updateUser({ username: 'admin', token: 'sdf32"£$FD' })).to.have.property('user')
      expect(
        updateUser({ username: 'admin', token: 'sdf32"£$FD' }).user
      ).to.deep.equal({ username: 'admin', token: 'sdf32"£$FD' })
    })
  })

  describe('(Action Creator) clearUser', () => {
    it('Should be exported as a function.', () => {
      expect(clearUser).to.be.a('function')
    })

    it('Should return an action with type "USER_UPDATE".', () => {
      expect(clearUser()).to.have.property('type', USER_UPDATE)
    })

    it('Should return an action with empty user.', () => {
      expect(clearUser()).to.have.property('user')
      expect(clearUser().user).to.deep.equal({})
    })
  })

  describe('(Action Handler) USER_UPDATE', () => {
    let _state = {}

    it('Should set the user object in the state.', () => {
      _state = userReducer(_state, { type : USER_UPDATE, user : { username: 'admin', token: 'sdf32"£$FD' } })
      expect(_state).to.deep.equal({ username: 'admin', token: 'sdf32"£$FD' })

      _state = userReducer(_state, { type : USER_UPDATE, user : {} })
      expect(_state).to.deep.equal({})
    })
  })
})

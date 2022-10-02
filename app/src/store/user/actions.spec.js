import { USER_UPDATE } from 'store/user/constants'
import { updateUser, clearUser } from 'store/user/actions'

describe('(Store) User', () => {
  describe('(Constants)', () => {
    it('Should export a constant USER_UPDATE.', () => {
      expect(USER_UPDATE).toBe('USER_UPDATE')
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
          updateUser({ username: 'admin', token: 'sdf32"£$FD' }).user,
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
})

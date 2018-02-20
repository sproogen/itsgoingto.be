/* eslint-env mocha */
/* global expect */
import {
  default as createStore
} from 'store/createStore'

describe('(Store) createStore', () => {
  let store

  before(() => {
    store = createStore()
  })

  it('should have an empty asyncReducers object', () => {
    expect(store.asyncReducers).to.be.an('object')
    expect(store.asyncReducers).to.be.empty()
  })

  describe('(Location)', () => {
    it('store should be initialized with Location state', () => {
      const location = {
        pathname : '/echo'
      }

      store.dispatch({
        type    : 'LOCATION_CHANGE',
        payload : location
      })
      expect(store.getState().location).to.deep.equal(location)
    })
  })

  describe('(Loader)', () => {
    it('store should be initialized with Loader state', () => {
      const loader = { loading : false, passphrase : false }

      expect(store.getState().loader).to.deep.equal(loader)
    })
  })

  describe('(Poll)', () => {
    it('store should be initialized with Poll state', () => {
      const poll = {
        polls : [],
        page  : null,
        count : 0
      }

      expect(store.getState().poll).to.deep.equal(poll)
    })
  })

  describe('(Answers)', () => {
    it('store should be initialized with Answers state', () => {
      const answers = []

      expect(store.getState().answers).to.deep.equal(answers)
    })
  })

  describe('(User)', () => {
    it('store should be initialized with User state', () => {
      const user = {}

      expect(store.getState().user).to.deep.equal(user)
    })
  })
})

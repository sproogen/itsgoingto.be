import createStore from 'store/create-store'

describe('(Store) createStore', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  it('should have an empty asyncReducers object', () => {
    expect(typeof store.asyncReducers).toBe('object')
    expect(store.asyncReducers).toEqual({})
  })

  describe('(Loader)', () => {
    it('store should be initialized with Loader state', () => {
      const loader = { loading: false, passphrase: false }

      expect(store.getState().loader).toEqual(loader)
    })
  })

  describe('(Poll)', () => {
    it('store should be initialized with Poll state', () => {
      const poll = {
        polls: [],
        page: 0,
        count: 0
      }

      expect(store.getState().poll).toEqual(poll)
    })
  })

  describe('(Answers)', () => {
    it('store should be initialized with Answers state', () => {
      const answers = []

      expect(store.getState().answers).toEqual(answers)
    })
  })

  describe('(User)', () => {
    it('store should be initialized with User state', () => {
      const user = {}

      expect(store.getState().user).toEqual(user)
    })
  })
})

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
    expect(LOADING_UPDATE).to.equal('LOADING_UPDATE')
  })
  it('Should export a constant PASSPHRASE_UPDATE.', () => {
    expect(PASSPHRASE_UPDATE).to.equal('PASSPHRASE_UPDATE')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(loaderReducer).to.be.a('function')
    })

    it('Should initialize with an initialState.', () => {
      expect(loaderReducer(undefined, {})).to.deep.equal({ loading : false, passphrase : false })
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = loaderReducer(undefined, {})
      expect(state).to.deep.equal({ loading : false, passphrase : false })
      state = loaderReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal({ loading : false, passphrase : false })

      state = true
      state = loaderReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(true)
    })
  })

  describe('(Selector) isLoadingSelector', () => {
    it('Should return the loader value from the global state.', () => {
      const globalState = { loader : { loading : true, passphrase : false } }
      expect(isLoadingSelector(globalState)).to.equal(true)
    })
  })

  describe('(Selector) requiresPassphraseSelector', () => {
    it('Should return the passphrase required value from the global state.', () => {
      const globalState = { loader : { loading : false, passphrase : true } }
      expect(requiresPassphraseSelector(globalState)).to.equal(true)
    })
  })

  describe('(Action Creator) setLoading', () => {
    it('Should be exported as a function.', () => {
      expect(setLoading).to.be.a('function')
    })

    it('Should return an action with type "LOADING_UPDATE".', () => {
      expect(setLoading()).to.have.property('type', LOADING_UPDATE)
    })

    it('Should assign the argument to the "loading" property.', () => {
      const loading = true
      expect(setLoading(loading)).to.have.property('loading', loading)
    })

    it('Should default the "loading" property to false if not provided.', () => {
      expect(setLoading()).to.have.property('loading', false)
    })
  })

  describe('(Action Creator) setRequiresPassphrase', () => {
    it('Should be exported as a function.', () => {
      expect(setRequiresPassphrase).to.be.a('function')
    })

    it('Should return an action with type "PASSPHRASE_UPDATE".', () => {
      expect(setRequiresPassphrase()).to.have.property('type', PASSPHRASE_UPDATE)
    })

    it('Should assign the argument to the "requiresPassphrase" property.', () => {
      const requiresPassphrase = true
      expect(setRequiresPassphrase(requiresPassphrase)).to.have.property('requiresPassphrase', requiresPassphrase)
    })

    it('Should default the "requiresPassphrase" property to false if not provided.', () => {
      expect(setRequiresPassphrase()).to.have.property('requiresPassphrase', false)
    })
  })

  describe('(Action Handler) LOADING_UPDATE', () => {
    it('Should update the state to the loading property', () => {
      let state = { loading : false, passphrase : false }
      expect(state.loading).to.equal(false)
      state = loaderReducer(state, { type : LOADING_UPDATE, loading : true })
      expect(state.loading).to.equal(true)
      state = loaderReducer(state, { type : LOADING_UPDATE, loading : false })
      expect(state.loading).to.equal(false)
    })
  })

  describe('(Action Handler) PASSPHRASE_UPDATE', () => {
    it('Should update the state to the passphrase property', () => {
      let state = { loading : false, passphrase : false }
      expect(state.passphrase).to.equal(false)
      state = loaderReducer(state, { type : PASSPHRASE_UPDATE, requiresPassphrase : true })
      expect(state.passphrase).to.equal(true)
      state = loaderReducer(state, { type : PASSPHRASE_UPDATE, requiresPassphrase : false })
      expect(state.passphrase).to.equal(false)
    })
  })
})

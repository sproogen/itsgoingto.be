import {
  LOADING_UPDATE,
  isLoadingSelector,
  setLoading,
  default as loaderReducer
} from 'store/loader'

describe('(Store) Loader', () => {
  it('Should export a constant LOADING_UPDATE.', () => {
    expect(LOADING_UPDATE).to.equal('LOADING_UPDATE')
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
})

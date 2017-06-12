import {
  LOADING_UPDATE,
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

    it('Should initialize with a initialState.', () => {
      expect(loaderReducer(undefined, {})).to.equal(false)
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = loaderReducer(undefined, {})
      expect(state).to.equal(false)
      state = loaderReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(false)

      const loaderState = true
      state = loaderReducer(state, setLoading(loaderState))
      expect(state).to.equal(loaderState)
      expect(state).to.equal(true)
      state = loaderReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(loaderState)
      expect(state).to.equal(true)
    })
  })

  describe('(Action) setLoading', () => {
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

  // TODO : Test Action Handler
})

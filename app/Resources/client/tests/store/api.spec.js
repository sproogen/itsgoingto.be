import {
  ROUTE_QUESTION,
  extractResponse,
  onError,
} from 'store/api'

describe('(Store) API', () => {
  it('Should export a constant ROUTE_QUESTION.', () => {
    expect(ROUTE_QUESTION).to.equal('/api/questions')
  })

  describe('(Helper) extractResponse', () => {
    it('Should be a function.', () => {
      expect(extractResponse).to.be.a('function')
    })
  })

  describe('(Helper) onError', () => {
    it('Should be a function.', () => {
      expect(onError).to.be.a('function')
    })
  })
})

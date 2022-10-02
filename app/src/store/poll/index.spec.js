import {
  POLL_UPDATE,
  POLLS_SET,
  POLL_PAGE_SET,
  POLL_COUNT_SET,
  QUESTION_UPDATE,
  POLLS_PER_PAGE,
  initialPoll,
} from 'store/poll/constants'
import pollReducer from 'store/poll'

const initialState = {
  polls: [],
  page: 0,
  count: 0,
}

describe('(Store) Poll', () => {
  describe('(Constants)', () => {
    it('Should export a constant POLL_UPDATE', () => {
      expect(POLL_UPDATE).toBe('POLL_UPDATE')
    })
    it('Should export a constant POLLS_SET', () => {
      expect(POLLS_SET).toBe('POLLS_SET')
    })
    it('Should export a constant POLL_PAGE_SET', () => {
      expect(POLL_PAGE_SET).toBe('POLL_PAGE_SET')
    })
    it('Should export a constant POLL_COUNT_SET', () => {
      expect(POLL_COUNT_SET).toBe('POLL_COUNT_SET')
    })
    it('Should export a constant QUESTION_UPDATE', () => {
      expect(QUESTION_UPDATE).toBe('QUESTION_UPDATE')
    })
    it('Should export a constant POLLS_PER_PAGE.', () => {
      expect(POLLS_PER_PAGE).toBe(10)
    })
    it('Should export a constant initialPoll.', () => {
      expect(initialPoll).toEqual({
        question: '',
        identifier: '',
        multipleChoice: false,
        passphrase: '',
        answers: [],
        userResponses: [],
      })
    })
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(typeof pollReducer).toBe('function')
    })

    it('Should initialize with a initialState.', () => {
      expect(pollReducer(undefined, {})).toEqual(initialState)
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = pollReducer(undefined, {})

      expect(state).toEqual(initialState)
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual(initialState)

      state = [initialPoll]
      state = pollReducer(state, { type: '@@@@@@@' })
      expect(state).toEqual([initialPoll])
    })
  })

  describe('(Action Handlers)', () => {
    describe('(Action Handler) POLL_UPDATE', () => {
      it('Should update the poll with identifier', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, {
          type : POLL_UPDATE,
          poll: {
            question: 'Question Text',
            identifier: 'hf0sd8fhoas',
            deleted: false,
            created: 'Some Date or other',
          },
        })
        expect(state).toEqual({
          polls: [{
            question: 'Question Text',
            identifier: 'hf0sd8fhoas',
            deleted: false,
            created: 'Some Date or other',
          }],
          page: null,
          count: 0,
        })

        state = pollReducer(state, {
          type :POLL_UPDATE,
          poll: {
            question: 'Different Question Text',
            identifier: 'hf0sd8fhoas',
            deleted: true,
            created: 'Some Date or other',
          },
        })
        expect(state).toEqual({
          polls: [{
            question: 'Different Question Text',
            identifier: 'hf0sd8fhoas',
            deleted: true,
            created: 'Some Date or other',
          }],
          page: null,
          count: 0,
        })
      })

      it('Should update the poll with identifier with just responses', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas', responsesCount: 5 }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, {
          type: POLL_UPDATE,
          poll: {
            identifier: 'hf0sd8fhoas',
            userResponses: [245],
            responsesCount: 6,
          },
        })
        expect(state).toEqual({
          polls: [{
            question: 'Question',
            identifier: 'hf0sd8fhoas',
            userResponses: [245],
            responsesCount: 6,
          }],
          page: null,
          count: 0,
        })

        state = pollReducer(state, {
          type: POLL_UPDATE,
          poll: {
            identifier: 'hf0sd8fhoas',
            userResponses: [245, 246],
            responsesCount: 7,
          },
        })
        expect(state).toEqual({
          polls: [{
            question: 'Question',
            identifier: 'hf0sd8fhoas',
            userResponses: [245, 246],
            responsesCount: 7,
          }],
          page: null,
          count: 0,
        })
      })

      it('Should insert a new poll', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }, { question: 'Question', identifier: '' }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, {
          type: POLL_UPDATE,
          poll: {
            question: 'Question Text',
            identifier: 'sf34rsdfsf',
            deleted: false,
            created: 'Some Date or other',
          },
        })
        expect(state).toEqual({
          polls: [
            { question: 'Question', identifier: 'hf0sd8fhoas' },
            { question: 'Question', identifier: '' },
            {
              question: 'Question Text',
              identifier: 'sf34rsdfsf',
              deleted: false,
              created: 'Some Date or other',
            },
          ],
          page: null,
          count: 0,
        })
      })
    })

    describe('(Action Handler) POLLS_SET', () => {
      it('Should set the polls in the state.', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, {
          type: POLLS_SET,
          polls: [
            { question: 'Question 1', identifier: 'gf43wfasdfds' },
            { question: 'Question 2', identifier: 'dfgbr5tfgdaf' },
          ],
        })
        expect(state).toEqual({
          polls: [
            { question: 'Question 1', identifier: 'gf43wfasdfds' },
            { question: 'Question 2', identifier: 'dfgbr5tfgdaf' },
          ],
          page: null,
          count: 0,
        })
      })
    })

    describe('(Action Handler) POLL_PAGE_SET', () => {
      it('Should set the poll page in the state.', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, { type : POLL_PAGE_SET, page : 5 })
        expect(state).toEqual({
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: 5,
          count: 0,
        })

        state = pollReducer(state, { type : POLL_PAGE_SET, page : 4 })
        expect(state).toEqual({
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: 4,
          count: 0,
        })
      })
    })

    describe('(Action Handler) POLL_COUNT_SET', () => {
      it('Should set the poll count in the state.', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, { type : POLL_COUNT_SET, count : 56 })
        expect(state).toEqual({
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 56,
        })

        state = pollReducer(state, { type : POLL_COUNT_SET, count : 102 })
        expect(state).toEqual({
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 102,
        })
      })
    })

    describe('(Action Handler) QUESTION_UPDATE', () => {
      it('Should update the question text for the poll with identifier', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, { type: QUESTION_UPDATE, question: 'Question Text', identifier: 'hf0sd8fhoas' })
        expect(state).toEqual({
          polls: [{ question: 'Question Text', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        })

        state = pollReducer(
          state,
          { type: QUESTION_UPDATE, question: 'Different Question Text', identifier: 'hf0sd8fhoas' },
        )
        expect(state).toEqual({
          polls: [{ question: 'Different Question Text', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        })
      })

      it('Should insert the question text as a new poll', () => {
        let state = {
          polls: [{ question: 'Question', identifier: 'hf0sd8fhoas' }],
          page: null,
          count: 0,
        }

        state = pollReducer(state, { type: QUESTION_UPDATE, question: 'Question Text', identifier: '' })
        expect(state).toEqual({
          polls: [
            { question: 'Question', identifier: 'hf0sd8fhoas' },
            {
              question: 'Question Text',
              identifier: '',
              multipleChoice: false,
              passphrase: '',
              userResponses: [],
            },
          ],
          page: null,
          count: 0,
        })
      })

      it('Should update the question text for a new poll', () => {
        let state = {
          polls: [
            { question: 'Question', identifier: 'hf0sd8fhoas' },
            { question: 'Question Text', identifier: '' },
          ],
          page: null,
          count: 0,
        }

        state = pollReducer(state, { type: QUESTION_UPDATE, question: 'Different Question Text', identifier: '' })
        expect(state).toEqual({
          polls: [
            { question: 'Question', identifier: 'hf0sd8fhoas' },
            { question: 'Different Question Text', identifier: '' },
          ],
          page: null,
          count: 0,
        })
      })
    })
  })
})

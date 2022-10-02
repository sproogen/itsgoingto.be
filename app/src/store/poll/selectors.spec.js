import {
  pollSelector,
  pollsSelector,
  pollPageSelector,
  pollCountSelector,
  questionSelector,
  hasQuestionSelector,
  totalResponsesSelector,
  userRespondedSelector,
} from 'store/poll/selectors'

describe('(Store) Poll', () => {
  describe('(Selectors)', () => {
    let globalState

    beforeEach(() => {
      globalState = {
        poll: {
          polls: [{
            question: 'Question',
            identifier: 'hf0sd8fhoas',
            responsesCount: 5,
          }],
          page: 0,
          count: 0,
        },
      }
    })

    describe('(Selector) pollSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof pollSelector).toBe('function')
      })

      it('Should return a poll with an identifier from the global state.', () => {
        expect(pollSelector(globalState, 'hf0sd8fhoas')).toEqual({
          question: 'Question',
          identifier: 'hf0sd8fhoas',
          responsesCount: 5,
        })
      })

      it('Should return an empty poll from the global state.', () => {
        expect(pollSelector(globalState, 'dasdfasd')).toEqual({
          question: '',
          identifier: '',
          multipleChoice: false,
          passphrase: '',
          userResponses: [],
        })
        expect(pollSelector(globalState)).toEqual({
          question: '',
          identifier: '',
          multipleChoice: false,
          passphrase: '',
          userResponses: [],
        })
      })
    })

    describe('(Selector) pollsSelector', () => {
      beforeEach(() => {
        globalState.poll.polls.push({
          question: 'Question 2',
          identifier: '',
        })
      })

      it('Should be exported as a function.', () => {
        expect(typeof pollsSelector).toBe('function')
      })

      it('Should return all polls from the global state.', () => {
        expect(pollsSelector(globalState)).toEqual([
          {
            question: 'Question',
            identifier: 'hf0sd8fhoas',
            responsesCount: 5,
          },
          {
            question: 'Question 2',
            identifier: '',
          },
        ])
      })

      it('Should only return real polls from the global state when populated is true.', () => {
        expect(pollsSelector(globalState, true)).toEqual([
          {
            question: 'Question',
            identifier: 'hf0sd8fhoas',
            responsesCount: 5,
          },
        ])
      })
    })

    describe('(Selector) pollPageSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof pollPageSelector).toBe('function')
      })

      it('Should return the poll page in the global state.', () => {
        expect(pollPageSelector(globalState)).toBe(0)

        globalState.poll.page = 2

        expect(pollPageSelector(globalState)).toBe(2)
      })
    })

    describe('(Selector) pollCountSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof pollCountSelector).toBe('function')
      })

      it('Should return the question text from a poll with an identifier in the global state.', () => {
        expect(pollCountSelector(globalState)).toBe(0)

        globalState.poll.count = 3

        expect(pollCountSelector(globalState)).toBe(3)
      })
    })

    describe('(Selector) questionSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof questionSelector).toBe('function')
      })

      it('Should return the question text from a poll with an identifier in the global state.', () => {
        expect(questionSelector(globalState, 'hf0sd8fhoas')).toBe('Question')
      })
    })

    describe('(Selector) hasQuestionSelector', () => {
      it('Should return true if question text from a poll with an identifier in the global state.', () => {
        expect(hasQuestionSelector(globalState, 'hf0sd8fhoas')).toBe(true)
      })

      it('Should return false if no question text from a poll with an identifier in the global state.', () => {
        expect(hasQuestionSelector(globalState, '')).toBe(false)
      })
    })

    describe('(Selector) totalResponsesSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof totalResponsesSelector).toBe('function')
      })

      it('Should return the responses count from a poll with an identifier in the global state.', () => {
        expect(totalResponsesSelector(globalState, 'hf0sd8fhoas')).toBe(5)
      })

      it('Should return a default of 0 if there is no value.', () => {
        globalState.poll.polls[0].responsesCount = undefined

        expect(totalResponsesSelector(globalState, 'hf0sd8fhoas')).toBe(0)
      })
    })

    describe('(Selector) userRespondedSelector', () => {
      it('Should be exported as a function.', () => {
        expect(typeof userRespondedSelector).toBe('function')
      })

      it('Should return false if there are no response from a poll with an identifier in the global state.', () => {
        globalState.poll.polls[0].userResponses = []

        expect(userRespondedSelector(globalState, 'hf0sd8fhoas')).toBe(false)
      })

      it('Should return true if there are response from a poll with an identifier in the global state.', () => {
        globalState.poll.polls[0].userResponses = [1]

        expect(userRespondedSelector(globalState, 'hf0sd8fhoas')).toBe(true)
      })
    })
  })
})

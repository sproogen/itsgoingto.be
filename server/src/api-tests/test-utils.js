import { all, is } from 'ramda'

const DATE_REGEX = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/

expect.extend({
  toBeISODateString(received) {
    if (received !== null && DATE_REGEX.test(received)) {
      return {
        message: () => `expected ${received} not to be an ISO 8601 date time formatted string`,
        pass: true,
      }
    }
    return {
      message: () => `expected ${received} to be an ISO 8601 date time formatted string`,
      pass: false,
    }
  },
  toBeISODateStringOrNull(received) {
    if (received === null || DATE_REGEX.test(received)) {
      return {
        message: () => `expected ${received} not to be an ISO 8601 date time formatted string`,
        pass: true,
      }
    }
    return {
      message: () => `expected ${received} to be an ISO 8601 date time formatted string`,
      pass: false,
    }
  },
  toBeArrayContainingNumbers(received) {
    if (Array.isArray(received) && all(is(Number), received)) {
      return {
        message: () => `expected ${received} not to be an array containing only numbers`,
        pass: true,
      }
    }
    return {
      message: () => `expected ${received} to be an array containing only numbers`,
      pass: false,
    }
  },
})

export const matchesPollFormat = (poll, expectAnswers = true, expectUserResponses = true) => {
  expect(Object.keys(poll).sort()).toStrictEqual([
    'id', 'identifier', 'question', 'multipleChoice', 'endDate', 'ended', 'deleted', 'created', 'updated',
    ...(expectAnswers ? ['answers'] : []), ...(expectUserResponses ? ['userResponses'] : []), 'responsesCount',
  ].sort())
  expect(poll.id).toEqual(expect.any(Number))
  expect(poll.identifier).toEqual(expect.any(String))
  expect(poll.question).toEqual(expect.any(String))
  expect(poll.multipleChoice).toEqual(expect.any(Boolean))
  expect(poll.endDate).toBeISODateStringOrNull()
  expect(poll.ended).toEqual(expect.any(Boolean))
  expect(poll.deleted).toEqual(expect.any(Boolean))
  expect(poll.created).toBeISODateString()
  expect(poll.updated).toBeISODateString()
  if (expectAnswers) {
    expect(Array.isArray(poll.answers)).toBe(true)
    poll.answers.forEach((answer) => {
      expect(Object.keys(answer)).toStrictEqual(['id', 'answer', 'responsesCount'])
      expect(answer.id).toEqual(expect.any(Number))
      expect(answer.answer).toEqual(expect.any(String))
      expect(answer.responsesCount).toEqual(expect.any(Number))
    })
  }
  if (expectUserResponses) {
    expect(poll.userResponses).toBeArrayContainingNumbers()
  }
  expect(poll.responsesCount).toEqual(expect.any(Number))
}

export const matchesResponsesFormat = (responses) => {
  expect(Object.keys(responses).sort()).toStrictEqual([
    'id', 'ended', 'answers', 'userResponses', 'responsesCount',
  ].sort())
  expect(responses.ended).toEqual(expect.any(Boolean))
  expect(Array.isArray(responses.answers)).toBe(true)
  responses.answers.forEach((answer) => {
    expect(Object.keys(answer)).toStrictEqual(['id', 'answer', 'responsesCount'])
    expect(answer.id).toEqual(expect.any(Number))
    expect(answer.answer).toEqual(expect.any(String))
    expect(answer.responsesCount).toEqual(expect.any(Number))
  })
  expect(responses.userResponses).toBeArrayContainingNumbers()
  expect(responses.responsesCount).toEqual(expect.any(Number))
}

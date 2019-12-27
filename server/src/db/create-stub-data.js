import { map } from 'ramda'

const formatAnswers = map((answer) => ({ answer }))

const createStubData = (Poll) => async () => {
  await Poll.create({
    identifier: 'a',
    question: 'This is a question?',
    answers: formatAnswers(['Answer a1', 'Answer a2', 'Answer a3'])
  }, {
    include: ['answers']
  })
  await Poll.create({
    question: 'This is another question?'
  }, {
    include: ['answers']
  })
  await Poll.create({
    identifier: 'b',
    question: 'This a protected poll?',
    passphrase: 'abc',
    answers: formatAnswers(['Answer b1', 'Answer b2', 'Answer b3'])
  }, {
    include: ['answers']
  })
  await Poll.create({
    identifier: 'c',
    question: 'This an ended poll?',
    endDate: new Date(),
    answers: formatAnswers(['Answer c1', 'Answer c2', 'Answer c3'])
  }, {
    include: ['answers']
  })
}

export default createStubData

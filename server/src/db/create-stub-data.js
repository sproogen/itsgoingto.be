import { map } from 'ramda'

// TODO: Add responses to stub

const formatAnswers = map((answer) => ({ answer }))

const createStubData = (Poll, User) => async () => {
  await Poll.create({
    identifier: 'a',
    question: 'This is a question?',
    multipleChoice: true,
    answers: formatAnswers(['Answer a1', 'Answer a2', 'Answer a3'])
  }, {
    include: ['answers']
  })
  await Poll.create({
    question: 'This is another question?',
    answers: formatAnswers(['Answer 1', 'Answer 2', 'Answer 3'])
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

  const user = User.build({ username: 'username' })
  user.password = 'password'
  await user.save()
}

export default createStubData

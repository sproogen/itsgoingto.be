import { ModelCtor } from 'sequelize'
import { map } from 'ramda'
import { PollInstance } from './models/poll'
import { ResponseInstance } from './models/response'
import { UserInstance } from './models/user'

const formatAnswers = map<string, { answer: string }>((answer) => ({ answer }))

const createStubData = (
  Poll: ModelCtor<PollInstance>,
  Response: ModelCtor<ResponseInstance>,
  User: ModelCtor<UserInstance>,
) => async (): Promise<void> => {
  const pollA = await Poll.create({
    identifier: 'a',
    question: 'This is a question?',
    answers: formatAnswers(['Answer a1', 'Answer a2', 'Answer a3']),
    multipleChoice: true,
  }, {
    include: ['answers'],
  })
  const responseA1 = await Response.create({
    customUserID: '98djhfdjs098321dsafhf2309',
  })
  await pollA.addResponse(responseA1)
  await pollA.answers[0].addResponse(responseA1)

  const responseA2 = await Response.create({
    customUserID: '98djhfdjs098321dsafhf2309',
  })
  await pollA.addResponse(responseA2)
  await pollA.answers[1].addResponse(responseA2)

  const responseA3 = await Response.create({
    customUserID: '89sdhfhjssodsifhfhfh8393',
  })
  await pollA.addResponse(responseA3)
  await pollA.answers[2].addResponse(responseA3)

  await Poll.create({
    question: 'This is another question?',
    answers: formatAnswers(['Answer 1', 'Answer 2', 'Answer 3']),
    multipleChoice: false,
  }, {
    include: ['answers'],
  })
  await Poll.create({
    identifier: 'b',
    question: 'This a protected poll?',
    answers: formatAnswers(['Answer b1', 'Answer b2', 'Answer b3']),
    multipleChoice: false,
    passphrase: 'abc',
  }, {
    include: ['answers'],
  })
  await Poll.create({
    identifier: 'c',
    question: 'This an ended poll?',
    answers: formatAnswers(['Answer c1', 'Answer c2', 'Answer c3']),
    multipleChoice: false,
    endDate: new Date(),
  }, {
    include: ['answers'],
  })
  await Poll.create({
    identifier: 'd',
    question: 'This a deleted poll?',
    answers: formatAnswers(['Answer d1', 'Answer d2', 'Answer d3']),
    multipleChoice: false,
    deleted: true,
  }, {
    include: ['answers'],
  })
  await Poll.create({
    identifier: 'e',
    question: 'This another poll?',
    answers: formatAnswers(['Answer e1', 'Answer e2', 'Answer e3']),
    multipleChoice: false,
  }, {
    include: ['answers'],
  })
  await Poll.create({
    identifier: 'f',
    question: 'This another multiple choice poll?',
    multipleChoice: true,
    answers: formatAnswers(['Answer f1', 'Answer f2', 'Answer f3']),
  }, {
    include: ['answers'],
  })

  const user = User.build({ username: 'username' })
  user.password = 'password'
  await user.save()
}

export default createStubData

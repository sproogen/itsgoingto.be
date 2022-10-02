import { map, omit, prop } from 'ramda'
import { getUserResponsesForPollSelector } from '../../db'
import { PollInstance } from '../../db/models/poll'

const generatePollResponse = async (
  poll: PollInstance,
  customUserID: string | false = '',
  includeAnswers = true,
  additionalPollExcludeFields: string[] = [''],
): Promise<Record<string, unknown>> => {
  let userResponses: number[] = []
  if (customUserID !== false && customUserID !== '') {
    userResponses = map(
      prop('answer_id'),
      await getUserResponsesForPollSelector(poll, customUserID),
    )
  }

  return {
    ...omit(
      ['passphrase', 'isProtected', ...additionalPollExcludeFields],
      poll.get({ plain: true }),
    ),
    responsesCount: await poll.countResponses(),
    ...(includeAnswers ? {
      answers: await Promise.all(
        map(
          async (answer) => ({
            ...omit(
              ['poll_id'],
              answer.get({ plain: true }),
            ),
            responsesCount: await answer.countResponses(),
          }),
          poll.answers,
        ),
      ),
    } : {}),
    ...(customUserID !== false ? { userResponses } : {}),
  }
}

export default generatePollResponse

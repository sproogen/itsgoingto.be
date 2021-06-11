import { Request, Response } from 'express'
import { Server } from 'socket.io'
import {
  isEmpty, defaultTo, isNil, pipe, append, reduceWhile, pathEq, find, map, prop, omit,
} from 'ramda'
import { Op } from 'sequelize'
import {
  Poll,
  Response as ResponseModel,
  Answer,
} from '../../db'
import { AnswerInstance } from '../../db/models/answer'

type Params = {
  identifier: string
}

type Body = {
  answers?: number | number[]
}

type Query = {
  passphrase?: string
}

const submitResponses = (io: Server) => (
  async (req: Request<Params, never, Body, Query>, res: Response): Promise<Response> => {
    const poll = await Poll.scope(['excludeDeleted']).findOne({
      attributes: ['id', 'passphrase', 'multipleChoice', 'ended'],
      where: {
        identifier: req.params.identifier,
      },
      include: [{
        model: Answer,
        as: 'answers',
      }],
    })

    if (isNil(poll)) {
      return res.status(404).send({ error: 'poll-not-found' })
    }

    if (
      poll.isProtected
      && poll.passphrase !== defaultTo('', req.query.passphrase)
    ) {
      return res.status(403).send({ error: 'incorrect-passphrase' })
    }

    if (poll.ended === true) {
      return res.status(400).send({ error: 'poll-ended' })
    }

    const answers = pipe<
    number | number[] | undefined,
    number | number[],
    number[],
    AnswerInstance[]
    >(
      defaultTo([]),
      (value) => (Array.isArray(value) ? value : [value]),
      reduceWhile<number, AnswerInstance[]>(
        (acc) => poll.multipleChoice || isEmpty(acc),
        (acc, answerId) => {
          const answer = find(pathEq(['dataValues', 'id'], answerId), poll.answers)
          if (!isNil(answer)) {
            return append(answer, acc)
          }
          return acc
        },
        [],
      ),
    )(req.body.answers)

    const errors: string[] = []

    if (answers.length === 0 && !poll.multipleChoice) {
      errors.push('No answers have been provided')
    }

    const customUserID = req.cookies.USERID
    if (!customUserID) {
      errors.push('USERID is required')
    }

    if (!isEmpty(errors)) {
      return res.status(400).send({ errors })
    }

    const responsesToRemove = await ResponseModel.findAll({
      where: {
        customUserID,
      },
      include: [{
        model: Poll,
        as: 'poll',
        required: true,
        attributes: [],
        where: {
          id: poll.id,
        },
      }, {
        model: Answer,
        as: 'answer',
        required: true,
        attributes: [],
        where: {
          id: {
            [Op.notIn]: map(prop('id'), answers),
          },
        },
      }],
    })

    await Promise.all(
      map(
        async (responseToRemove) => responseToRemove.destroy(),
        responsesToRemove,
      ),
    )

    await Promise.all(
      map(
        async (answer) => {
          let response = await ResponseModel.findOne({
            where: {
              customUserID,
            },
            include: [{
              model: Poll,
              as: 'poll',
              required: true,
              attributes: [],
              where: {
                id: poll.id,
              },
            }, {
              model: Answer,
              as: 'answer',
              required: true,
              attributes: [],
              where: {
                id: answer.id,
              },
            }],
          })

          if (isNil(response)) {
            response = await ResponseModel.create({
              customUserID,
            })

            await poll.addResponse(response)
            await answer.addResponse(response)
          }
        },
        answers,
      ),
    )

    const userResponses = map(prop('id'), answers)

    const responseAsJson = JSON.parse(JSON.stringify(poll))
    io.of('/responses').to(`${req.params.identifier}/${customUserID}`).emit('own-responses-updated', responseAsJson)
    io.of('/responses').to(req.params.identifier).emit('responses-updated', responseAsJson)

    return res.json({
      ...omit(
        ['multipleChoice', 'passphrase'],
        poll.get({ plain: true }),
      ),
      responsesCount: await poll.countResponses(),
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
      userResponses,
    })
  }
)

export default submitResponses

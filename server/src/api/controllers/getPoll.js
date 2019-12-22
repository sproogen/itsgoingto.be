const poll = {
  id: 1,
  identifier: 'v90034d6',
  question: 'Is this a question?',
  multipleChoice: false,
  endDate: {
    date: '2017-05-18 13:45:37.000000',
    timezone_type: 3,
    timezone: 'Europe/London'
  },
  ended: false,
  deleted: false,
  created: {
    date: '2017-05-18 13:45:37.000000',
    timezone_type: 3,
    timezone: 'Europe/London'
  },
  updated: {
    date: '2017-05-18 13:45:37.000000',
    timezone_type: 3,
    timezone: 'Europe/London'
  },
  answers: [
    {
      id: 1,
      answer: 'Answer Text',
      poll: {
        type: 'Poll',
        id: 1
      },
      responsesCount: 2
    },
    {
      id: 2,
      answer: 'Answer Text',
      poll: {
        type: 'Poll',
        id: 1
      },
      responsesCount: 3
    }
  ],
  userResponses : [
    2
  ],
  responsesCount: 5
}

export default function getPoll(req, res) {
  res.send(poll)
}

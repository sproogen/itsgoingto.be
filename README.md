# itsgoingto.be [![Build Status](https://travis-ci.org/sproogen/itsgoingto.be.svg)](https://travis-ci.org/sproogen/itsgoingto.be) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/95ef266848d44348a421142d2ed6f8cb)](https://www.codacy.com/app/sproogen/itsgoingto.be?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sproogen/itsgoingto.be&amp;utm_campaign=Badge_Grade) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/95ef266848d44348a421142d2ed6f8cb)](https://www.codacy.com/app/sproogen/itsgoingto.be?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sproogen/itsgoingto.be&amp;utm_campaign=Badge_Coverage)

Symfony and React magic behind itsgoingto.be

The root of this project contains the Symfony app.

The React app can be found at app/Resources/client. This can been loaded through symfony for developing or compiled into the web folder for prodcution builds.

There are a number of number of NPM scripts that can be run from the project root.

API
-------------
Retrieve Questions: [```GET /api/questions```](#retrieve-questions)

Retrieve a Question: [```GET /api/questions/:identifier```](#retrieve-a-question)

Create a Question: [```POST /api/questions```](#create-a-question)

Delete a Question: [```DELETE /api/questions/:identifier```](#delete-a-question)

Retrieve responses info: [```GET /api/questions/:identifier/responses```](#retrieve-responses-info)

Submit/Change  users response: [```POST /api/questions/:identifier/responses```](#submitchange-a-user-response)

#### Retrieve Questions
Only returns non deleted questions unless the user has `ROLE_ADMIN`
```
GET /api/questions
```
###### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| page | integer | The page to return. Default: 1 |
| pageSize | integer | The ammount of results to retur per page. Default: 20 |
###### Response
```
{
  'count': 20,
  'total': 100,
  'entities':[
    {
      "id": 1,
      "identifier": "v90034d6",
      "question": "Is this a question?",
      "multipleChoice": false,
      "deleted": false,
      "created": {
        "date": "2017-05-18 13:45:37.000000",
        "timezone_type": 3,
        "timezone": "Europe/London"
      },
      "updated": {
        "date": "2017-05-18 13:45:37.000000",
        "timezone_type": 3,
        "timezone": "Europe/London"
      },
      "answers": [
        {
          "type": "Answer",
          "id": 1
        },
        {
          "type": "Answer",
          "id": 2
        }
      ],
      "responsesCount": 5
    },
    ...
  ]
}
```

#### Retrieve a Question
Only returns a non deleted question unless the user has `ROLE_ADMIN`
```
GET /api/questions/:identifier
```
###### Response
```
{
  "id": 1,
  "identifier": "v90034d6",
  "question": "Is this a question?",
  "multipleChoice": false,
  "deleted": false,
  "created": {
    "date": "2017-05-18 13:45:37.000000",
    "timezone_type": 3,
    "timezone": "Europe/London"
  },
  "updated": {
    "date": "2017-05-18 13:45:37.000000",
    "timezone_type": 3,
    "timezone": "Europe/London"
  },
  "answers": [
    {
      "id": 1,
      "answer": "Answer Text",
      "question": {
        "type": "Question",
        "id": 1
      },
      "responsesCount": 2
    },
    {
      "id": 2,
      "answer": "Answer Text",
      "question": {
        "type": "Question",
        "id": 1
      },
      "responsesCount": 3
    }
  ],
  "userResponses" : [
    2
  ],
  "responsesCount": 5
}
```

#### Create a Question
```
POST /api/questions
```
###### Input
| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| question | string | true | The question text.
| answers | array | true | Array of answers for the question. Each answer should be a string |
| multipleChoice | boolean | false | Is the question multiple choice. Default: false |
###### Response
```
{
  "id": 1,
  "identifier": "v90034d6",
  "question": "Is this a question?",
  "multipleChoice": false,
  "deleted": false,
  "created": {
    "date": "2017-05-18 13:45:37.000000",
    "timezone_type": 3,
    "timezone": "Europe/London"
  },
  "updated": {
    "date": "2017-05-18 13:45:37.000000",
    "timezone_type": 3,
    "timezone": "Europe/London"
  },
  "answers": [
    {
      "id": 1,
      "answer": "Answer Text",
      "question": {
        "type": "Question",
        "id": 1
      },
      "responsesCount": 0
    },
    {
      "id": 2,
      "answer": "Answer Text",
      "question": {
        "type": "Question",
        "id": 1
      },
      "responsesCount": 0
    }
  ],
  "userResponses": [],
  "responsesCount": 0
}
```

#### Delete a Question
Sets the deleted flag to true. Can only be accessed by `ROLE_ADMIN`
```
DELETE /api/questions/:identifier
```
###### Response
```
{
  "id": 1,
  "identifier": "v90034d6",
  "question": "Is this a question?",
  "multipleChoice": false,
  "deleted": true,
  "created": {
    "date": "2017-05-18 13:45:37.000000",
    "timezone_type": 3,
    "timezone": "Europe/London"
  },
  "updated": {
    "date": "2017-05-18 13:45:37.000000",
    "timezone_type": 3,
    "timezone": "Europe/London"
  },
  "answers": [
    {
      "type": "Answer",
      "id": 1
    },
    {
      "type": "Answer",
      "id": 2
    }
  ],
  "responsesCount": 5
}
```

#### Retrieve responses info
Only returns non deleted question's responses unless the user has `ROLE_ADMIN`
```
GET /api/questions/:identifier/responses
```
###### Response
```
{
  "userResponses" : [
    2
  ],
  "responsesCount": 5,
  "answers": [
    {
      "id": 1,
      "responsesCount": 2
    },
    {
      "id": 2,
      "responsesCount": 3
    }
  ]
}
```

#### Submit/Change a user response
```
POST /api/questions/:identifier/responses
```
###### Input
| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| answers | array | true | Array of answer ids the user has selected. If the question is not multiple choice only the first will be used. |
###### Response
```
{
  "userResponses": [
    2
  ],
  "responsesCount": 6,
  "responses" : [
    1
  ],
  "answers": [
    {
      "id": 1,
      "responsesCount": 3
    },
    {
      "id": 2,
      "responsesCount": 3
    }
  ]
}
```


Copyright
-------------
```
Copyright (c) 2015 James Grant
```

License
-------------
```
ItsGoingToBe is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ItsGoingToBe is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ItsGoingToBe.  If not, see <http://www.gnu.org/licenses/>.
```

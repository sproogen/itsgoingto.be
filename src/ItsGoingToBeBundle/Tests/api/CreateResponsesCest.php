<?php

namespace ItsGoingToBeBundle\Tests\api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for POST /api/polls/:identifier/responses
 */
class CreateResponsesCest extends BaseApiCest
{
    public function checkRouteTest(ApiTester $I)
    {
        $I->wantTo('Check call return 400');
        $I->sendPOST('/polls/he7gis/responses');
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
    }

    public function returns404Test(ApiTester $I)
    {
        $I->wantTo('Check call return 404');
        $I->sendPOST('/polls/y3k0sn/responses');
        $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
        $I->seeResponseIsJson();
    }

    public function returnsErrorMessagesAnd400Test(ApiTester $I)
    {
        $I->wantTo('Check call returns errors');
        $I->sendPOST('/polls/he7gis/responses');
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
        'errors' => 'array',
        ]);
        $I->seeResponseContainsJson([
        'errors' => [
        'No answers have been provided'
        ]
        ]);
    }

    public function returnsResponseAndPersistsResponseTest(ApiTester $I)
    {
        $I->wantTo('Check call returns responses and persists responses');
        $I->sendPOST('/polls/he7gis/responses', [
        'answers' => [
        $this->polls[0]->getAnswers()[1]->getId()
        ]
        ]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
        'responsesCount' => 'integer',
        'answers'        => 'array',
        'userResponses'  => 'array'
        ]);
        $I->seeResponseMatchesJsonType(
            [
            'id'             => 'integer',
            'responsesCount' => 'integer'
            ],
            '$.answers[*]'
        );
        $I->seeResponseContainsJson([
        'responsesCount' => 3,
        'userResponses'  => [$this->polls[0]->getAnswers()[1]->getId()],
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getAnswers()[0]->getId(),
            'responsesCount' => 2
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getAnswers()[1]->getId(),
            'responsesCount' => 1
            ],
            '$.answers[1]'
        );
    }

    public function returnsResponseAndUpdatesResponseTest(ApiTester $I)
    {
        $I->sendPOST('/polls/he7gis/responses', [
        'answers' => [
        $this->polls[0]->getAnswers()[1]->getId()
        ]
        ]);

        $I->wantTo('Check call returns responses and persists responses');
        $I->sendPOST('/polls/he7gis/responses', [
        'answers' => [
        $this->polls[0]->getAnswers()[0]->getId()
        ]
        ]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
        'responsesCount' => 'integer',
        'answers'        => 'array',
        'userResponses'  => 'array'
        ]);
        $I->seeResponseMatchesJsonType(
            [
            'id'             => 'integer',
            'responsesCount' => 'integer'
            ],
            '$.answers[*]'
        );
        $I->seeResponseContainsJson([
        'responsesCount' => 3,
        'userResponses'  => [$this->polls[0]->getAnswers()[0]->getId()],
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getAnswers()[0]->getId(),
            'responsesCount' => 3
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getAnswers()[1]->getId(),
            'responsesCount' => 0
            ],
            '$.answers[1]'
        );
    }

    public function returnsResponseAndPersistsMultipleResponsesTest(ApiTester $I)
    {
        $poll = $this->createPoll($I, [
        'identifier'     => 'h27ngu',
        'question'       => 'Test Question Multiple',
        'multipleChoice' => true,
        'deleted'        => false,
        'answers'        => [
        'Answer 1',
        'Answer 2'
        ]
        ]);

        $I->wantTo('Check call returns responses and persists multiple responses');
        $I->sendPOST('/polls/h27ngu/responses', [
        'answers' => [
        $poll->getAnswers()[0]->getId(),
        $poll->getAnswers()[1]->getId()
        ]
        ]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
        'responsesCount' => 'integer',
        'answers'        => 'array',
        'userResponses'  => 'array'
        ]);
        $I->seeResponseMatchesJsonType(
            [
            'id'             => 'integer',
            'responsesCount' => 'integer'
            ],
            '$.answers[*]'
        );
        $I->seeResponseContainsJson([
        'responsesCount' => 2,
        'userResponses'  => [
        $poll->getAnswers()[0]->getId(),
        $poll->getAnswers()[1]->getId()
        ],
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $poll->getAnswers()[0]->getId(),
            'responsesCount' => 1
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
            'id'             => $poll->getAnswers()[1]->getId(),
            'responsesCount' => 1
            ],
            '$.answers[1]'
        );

        $I->sendPOST('/polls/h27ngu/responses', [
        'answers' => [
        $poll->getAnswers()[0]->getId()
        ]
        ]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
        'responsesCount' => 'integer',
        'answers'        => 'array',
        'userResponses'  => 'array'
        ]);
        $I->seeResponseMatchesJsonType(
            [
            'id'             => 'integer',
            'responsesCount' => 'integer'
            ],
            '$.answers[*]'
        );
        $I->seeResponseContainsJson([
        'responsesCount' => 1,
        'userResponses'  => [$poll->getAnswers()[0]->getId()],
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $poll->getAnswers()[0]->getId(),
            'responsesCount' => 1
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
            'id'             => $poll->getAnswers()[1]->getId(),
            'responsesCount' => 0
            ],
            '$.answers[1]'
        );
    }
}
